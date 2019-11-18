package com.cpen321.cloutservices.timeline;

import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import androidx.recyclerview.widget.RecyclerView;

public class RestaurantAdapter extends RecyclerView.Adapter<RestaurantAdapter.ViewHolder> {

    private ArrayList<Restaurant> restaurants;

    private static final String ID_TAG = "id";
    private static final String IMG = "img";
    private static final String ADDR = "addr";
    private static final String NAME = "name";
    private static final String LATITUDE = "lat";
    private static final String LONGITUDE = "long";

    public RestaurantAdapter(ArrayList<Restaurant> restaurants) {
        this.restaurants = restaurants;
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
        viewHolder.restaurantLineup.setText("Lineup: " + restaurants.get(i).getLineupTime() + " minutes");
        viewHolder.restaurantDistance.setText("Distance: " + (int)restaurants.get(i).getDistance() + " metres");

        viewHolder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(v.getContext(), ReportQueueActivity.class);
                intent.putExtra(ID_TAG, restaurants.get(index).getId());
                intent.putExtra(IMG, restaurants.get(index).getImageUrl());
                intent.putExtra(ADDR, restaurants.get(index).getLocation().getDisplayAddressFormatted());
                intent.putExtra(NAME, restaurants.get(index).getName());
                intent.putExtra(LATITUDE, restaurants.get(index).getCoordinates().getLatitude());
                intent.putExtra(LONGITUDE, restaurants.get(index).getCoordinates().getLongitude());
                v.getContext().startActivity(intent);
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

        public ViewHolder(View v) {
            super(v);

            view = v;
            restaurantImage = v.findViewById(R.id.restaurantImage);
            restaurantName = v.findViewById(R.id.restaurantName);
            restaurantAddress = v.findViewById(R.id.restaurantAddress);
            restaurantLineup = v.findViewById(R.id.restaurantLineup);
            restaurantDistance = v.findViewById(R.id.restaurantDistance);
        }
    }
}
