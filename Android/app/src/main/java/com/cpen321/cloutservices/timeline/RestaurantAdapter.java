package com.cpen321.cloutservices.timeline;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.cpen321.cloutservices.timeline.model.FavoriteService;
import com.cpen321.cloutservices.timeline.model.Favorites;
import com.cpen321.cloutservices.timeline.model.Location;
import com.cpen321.cloutservices.timeline.model.PostFavoriteHelper;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;
import java.util.HashSet;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RestaurantAdapter extends RecyclerView.Adapter<RestaurantAdapter.ViewHolder> {
    private static final String ID_TAG = "id";
    private static final String IMG = "img";
    private static final String ADDR = "addr";
    private static final String FULL_ADDR = "full_addr";
    private static final String NAME = "name";
    private static final String LATITUDE = "lat";
    private static final String LONGITUDE = "long";
    private static final String DISTANCE = "distance";
    private static final String LINEUP = "lineup";
    private static final String FAVORITED = "isFavorited";

    private ArrayList<Restaurant> restaurants;
    private HashSet<String> favoritedRestaurantID;
    private String email;

    public RestaurantAdapter(ArrayList<Restaurant> restaurants, HashSet<String> favoritedRestaurantID, String email) {
        this.restaurants = restaurants;
        this.favoritedRestaurantID = favoritedRestaurantID;
        this.email = email;
    }

    @Override
    public RestaurantAdapter.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.search_row, viewGroup, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(RestaurantAdapter.ViewHolder viewHolder, int i) {
        final int index = i;

        Picasso.get().load(Uri.parse(restaurants.get(i).getImageUrl())).error(R.drawable.ic_clear_24px).into(viewHolder.restaurantImage);
        viewHolder.restaurantName.setText(restaurants.get(i).getName());
        viewHolder.restaurantAddress.setText(restaurants.get(i).getLocation().getDisplayAddressFormatted());
        viewHolder.restaurantLineup.setText("Lineup: " + restaurants.get(i).getLineupTime()/1000 + " seconds");
        viewHolder.restaurantDistance.setText("Distance: " + (int)restaurants.get(i).getDistance() + " metres");

        if (favoritedRestaurantID.contains(restaurants.get(i).getId())) {
            viewHolder.favoriteStar.setImageResource(R.drawable.ic_star_24px);
        } else {
            viewHolder.favoriteStar.setImageResource(R.drawable.ic_star_border_24px);
        }

        viewHolder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), ReportQueueActivity.class);
                intent.putExtra(ID_TAG, restaurants.get(index).getId());
                intent.putExtra(IMG, restaurants.get(index).getImageUrl());
                intent.putExtra(ADDR, restaurants.get(index).getLocation().getDisplayAddressFormatted());
                intent.putExtra(FULL_ADDR, restaurants.get(index).getLocation().getDisplayAddress());
                intent.putExtra(NAME, restaurants.get(index).getName());
                intent.putExtra(LATITUDE, restaurants.get(index).getCoordinates().getLatitude());
                intent.putExtra(LONGITUDE, restaurants.get(index).getCoordinates().getLongitude());
                intent.putExtra(DISTANCE, restaurants.get(index).getDistance());
                intent.putExtra(LINEUP, restaurants.get(index).getLineupTime());
                intent.putExtra(FAVORITED, favoritedRestaurantID.contains(restaurants.get(index).getId()));
                v.getContext().startActivity(intent);
            }
        });

        viewHolder.favoriteStar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // if set contains it, set to border/remove from set/send delete to backend, else set to normal/add to set/send add to backend
                if (!favoritedRestaurantID.contains(restaurants.get(index).getId())) {
                    viewHolder.favoriteStar.setImageResource(R.drawable.ic_star_24px);
                    favoritedRestaurantID.add(restaurants.get(index).getId());
                    favoriteRestaurant(restaurants.get(index));
                } else {
                    viewHolder.favoriteStar.setImageResource(R.drawable.ic_star_border_24px);
                    favoritedRestaurantID.remove(restaurants.get(index).getId());
                    unfavoriteRestaurant(restaurants.get(index));
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return restaurants.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        private View view;
        private ImageView restaurantImage;
        private TextView restaurantName;
        private TextView restaurantAddress;
        private TextView restaurantLineup;
        private TextView restaurantDistance;
        private ImageView favoriteStar;

        public ViewHolder(View v) {
            super(v);

            view = v;
            restaurantImage = v.findViewById(R.id.restaurantImage);
            restaurantName = v.findViewById(R.id.restaurantName);
            restaurantAddress = v.findViewById(R.id.restaurantAddress);
            restaurantLineup = v.findViewById(R.id.restaurantLineup);
            restaurantDistance = v.findViewById(R.id.restaurantDistance);
            favoriteStar = v.findViewById(R.id.favorites_star);
        }
    }

    private void favoriteRestaurant(Restaurant restaurant) {
        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w("GET_INSTANCE_ID", "getInstanceId failed", task.getException());
                    return;
                }

                // Get new Instance ID token
                String token = task.getResult().getToken();

                // Log and toast
                Log.d("GET_INSTANCE_ID", token);

                FavoriteService favorites = RetrofitClientHelper.getRetrofitInstance().create(FavoriteService.class);
                PostFavoriteHelper helper = new PostFavoriteHelper(restaurant, token);
                Call<Favorites> postFavorite = favorites.postUserFavorite(email, helper);
                postFavorite.enqueue(new Callback<Favorites>() {
                    @Override
                    public void onResponse(Call<Favorites> call, Response<Favorites> response) {
                        Log.e("NOTIFICATION SUB", "Call sent");
                    }

                    @Override
                    public void onFailure(Call<Favorites> call, Throwable t) {
                        Log.e("NOTIFICATION SUB", "Possibly failed to subscribe, reason: " + t.getCause());
                    }
                });
            }
        });
    }

    private void unfavoriteRestaurant(Restaurant restaurant) {
        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w("GET_INSTANCE_ID", "getInstanceId failed", task.getException());
                    return;
                }

                // Get new Instance ID token
                String token = task.getResult().getToken();

                // Log and toast
                Log.d("GET_INSTANCE_ID", token);

                FavoriteService favorites = RetrofitClientHelper.getRetrofitInstance().create(FavoriteService.class);
                PostFavoriteHelper helper = new PostFavoriteHelper(null, token);
                Call<Favorites> deleteFavorite = favorites.deleteUserFavorite(email, restaurant.getId(), helper);
                deleteFavorite.enqueue(new Callback<Favorites>() {
                    @Override
                    public void onResponse(Call<Favorites> call, Response<Favorites> response) {
                        Log.e("NOTIFICATION SUB", "Call sent");
                    }

                    @Override
                    public void onFailure(Call<Favorites> call, Throwable t) {
                        Log.e("NOTIFICATION SUB", "Possibly failed to subscribe, reason: " + t.getCause());
                    }
                });
            }
        });
    }
}
