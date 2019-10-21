package com.cpen321.cloutservices.timeline;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.os.Looper;
import android.provider.Settings;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.SearchView;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Businesses;
import com.cpen321.cloutservices.timeline.model.Notification;
import com.cpen321.cloutservices.timeline.model.NotificationService;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.cpen321.cloutservices.timeline.model.RestaurantService;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class SearchFragment extends Fragment {

    private FusedLocationProviderClient fusedLocationProviderClient;
    private Location currentLocation;
    private SearchView searchView;
    private RecyclerView recyclerView;
    private RestaurantAdapter restaurantAdapter;

    private final int PERMISSION_ID = 42;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_search, container, false);
        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(getActivity());
        getLastLocation();
        configureSearchView(view);
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    private void getLastLocation() {
        if (checkPermissions()) {
            if (checkLocationEnabled()) {
                Task locationTask = fusedLocationProviderClient.getLastLocation();
                locationTask.addOnSuccessListener(new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        if ( location == null) {
                            requestNewLocationData();
                        } else {
                            currentLocation = location;
                            Log.w("LOCATION INFO", "Latitude " + currentLocation.getLatitude() + " longitude " + currentLocation.getLongitude());
                        }
                    }
                });
            } else {
                Toast.makeText(getActivity(), "Turn on location", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                startActivity(intent);
            }
        } else {
            requestPermissions();
        }
    }

    private void configureSearchView(View v) {
        searchView = v.findViewById(R.id.search_view);
        recyclerView = v.findViewById(R.id.search_recycler_view);

        recyclerView.setHasFixedSize(true);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                RestaurantService restaurantService = RetrofitClientInstance.getRetrofitInstance().create(RestaurantService.class);
                Call<Businesses> call = restaurantService.getJSON(query, currentLocation.getLatitude(), currentLocation.getLongitude());

                call.enqueue(new Callback<Businesses>() {
                    @Override
                    public void onResponse(Call<Businesses> call, Response<Businesses> response) {
                        Toast.makeText(getActivity(), "Good", Toast.LENGTH_SHORT).show();
                        List<Restaurant> restaurants = response.body().getBusinesses();
                        Collections.sort(restaurants, new Comparator<Restaurant>() {
                            @Override
                            public int compare(Restaurant r1, Restaurant r2) {
                                if (r1.getDistance() < r2.getDistance()) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            }
                        });

                        restaurantAdapter = new RestaurantAdapter((ArrayList)restaurants);
                        recyclerView.setAdapter(restaurantAdapter);
                    }

                    @Override
                    public void onFailure(Call<Businesses> call, Throwable t) {
                        Toast.makeText(getActivity(), "Failed to retrieve restaurants: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        Log.e("QUERY_FAIL", t.getMessage());
                    }
                });

                searchView.clearFocus();
                return true;
            }

            @Override
            public boolean onQueryTextChange(String query) {
                return false;
            }
        });
    }

    private void requestNewLocationData() {
        LocationRequest locationRequest = new LocationRequest();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(0);
        locationRequest.setFastestInterval(0);
        locationRequest.setNumUpdates(1);

        LocationCallback locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult != null) {
                    getLastLocation();
                }
            }
        };

        fusedLocationProviderClient.requestLocationUpdates(locationRequest, locationCallback, Looper.myLooper());
    }

    private boolean checkLocationEnabled() {
        LocationManager locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) || locationManager.isProviderEnabled(locationManager.NETWORK_PROVIDER);
    }

    private boolean checkPermissions() {
        if (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            return true;
        } else {
            return false;
        }
    }

    private void requestPermissions() {
        String[] permissions = {Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION};
        ActivityCompat.requestPermissions(getActivity(), permissions, PERMISSION_ID);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String[] permissions, int[] grantResults) {
        if (requestCode == PERMISSION_ID && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            getLastLocation();
        }
    }
}
