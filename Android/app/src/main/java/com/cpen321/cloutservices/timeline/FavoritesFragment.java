package com.cpen321.cloutservices.timeline;

import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Businesses;
import com.cpen321.cloutservices.timeline.model.FavoriteService;
import com.cpen321.cloutservices.timeline.model.Favorites;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.google.android.gms.auth.api.signin.GoogleSignIn;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;


public class FavoritesFragment extends Fragment {
    private RecyclerView recyclerView;
    private ConstraintLayout favoritesInstructions;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_favorites, container, false);
        favoritesInstructions = view.findViewById(R.id.favorites_empty_symbol);

        configureFavoritesView(view);

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        getFavorites();
    }

    private void configureFavoritesView(View v) {
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView = v.findViewById(R.id.favorites_recycler_view);
        recyclerView.setLayoutManager(layoutManager);

        getFavorites();
    }

    private void getFavorites() {
        FavoriteService favoriteService = RetrofitClientHelper.getRetrofitInstance().create(FavoriteService.class);
        Call<Favorites> getFavorites = favoriteService.getUserFavorites(GoogleSignIn.getLastSignedInAccount(getActivity()).getEmail());

        getFavorites.enqueue(new Callback<Favorites>() {
            @Override
            public void onResponse(Call<Favorites> call, Response<Favorites> response) {
                Favorites resultingFavorites = response.body();

                if (resultingFavorites == null) {
                    Toast.makeText(getActivity(), "Failed to get favorites, please try again!", Toast.LENGTH_SHORT).show();
                    return;
                } else if (resultingFavorites.getFavorites().length == 0) {
                    favoritesInstructions.setVisibility(View.VISIBLE);
                    RestaurantAdapter restaurantAdapter = new RestaurantAdapter(new ArrayList<Restaurant>(), new HashSet<String>(), GoogleSignIn.getLastSignedInAccount(getActivity()).getEmail());
                    recyclerView.setAdapter(restaurantAdapter);
                    return;
                }

                favoritesInstructions.setVisibility(View.GONE);
                Call<Businesses> getRestaurants = favoriteService.getRestaurantsFromIDs(resultingFavorites.getFavoritesString());

                getRestaurants.enqueue(new Callback<Businesses>() {
                    @Override
                    public void onResponse(Call<Businesses> call, Response<Businesses> response) {
                        if (response.body() == null) {
                            Toast.makeText(getActivity(), "Failed to get restaurant information, please try again!", Toast.LENGTH_SHORT).show();
                            return;
                        }

                        List<Restaurant> favoritedRestaurants = response.body().getBusinesses();

                        if (favoritedRestaurants.size() == 0) {
                            favoritesInstructions.setVisibility(View.VISIBLE);
                            return;
                        }

                        favoritesInstructions.setVisibility(View.GONE);

                        Collections.sort(favoritedRestaurants, new Comparator<Restaurant>() {
                            @Override
                            public int compare(Restaurant r1, Restaurant r2) {
                                if (r1.getDistance() < r2.getDistance()) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            }
                        });

                        RestaurantAdapter restaurantAdapter = new RestaurantAdapter((ArrayList)favoritedRestaurants, resultingFavorites.getFavoritesSet(), GoogleSignIn.getLastSignedInAccount(getActivity()).getEmail());
                        recyclerView.setAdapter(restaurantAdapter);
                    }

                    @Override
                    public void onFailure(Call<Businesses> call, Throwable t) {
                        Toast.makeText(getActivity(), "Failed to retrieve favorites: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        Log.e("QUERY_FAIL", t.getMessage());
                    }
                });
            }

            @Override
            public void onFailure(Call<Favorites> call, Throwable t) {
                Toast.makeText(getActivity(), "Failed to retrieve favorites: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("QUERY_FAIL", t.getMessage());
            }
        });
    }
}
