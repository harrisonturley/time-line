package com.cpen321.cloutservices.timeline;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.cpen321.cloutservices.timeline.model.Restaurant;

import java.util.ArrayList;

import androidx.recyclerview.widget.RecyclerView;

public class RestaurantAdapter extends RecyclerView.Adapter<RestaurantAdapter.ViewHolder> {

    private ArrayList<Restaurant> restaurants;

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
        viewHolder.tv_name.setText(restaurants.get(i).getName());
        viewHolder.tv_version.setText(restaurants.get(i).getId());
        viewHolder.tv_api.setText(restaurants.get(i).getImageUrl());
    }

    @Override
    public int getItemCount() {
        return restaurants.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        private TextView tv_name, tv_version, tv_api;

        public ViewHolder(View v) {
            super(v);

            tv_name = v.findViewById(R.id.tv_name);
            tv_version = v.findViewById(R.id.tv_version);
            tv_api = v.findViewById(R.id.tv_api_level);
        }
    }
}
