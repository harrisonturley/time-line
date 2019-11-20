package com.cpen321.cloutservices.timeline;

import android.content.Context;
import android.os.Bundle;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.SystemClock;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.ContributedRestaurants;
import com.cpen321.cloutservices.timeline.model.Restaurant;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AwardsFragment extends Fragment {
    private RecyclerView recyclerView;
    private TextView awardsPoints;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_awards, container, false);
        configureAwardsView(view);
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

    private void configureAwardsView(View v) {
        recyclerView = v.findViewById(R.id.award_recycler_view);

        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);
        /* TODO: what should our list of contributed restaurants be? */
        List<Restaurant>  restaurants = ContributedRestaurants.getInstance().getContributedRestaurants();
        // Maybe an API call to retrieve info about user points?

        RestaurantAdapter restaurantAdapter = new RestaurantAdapter((ArrayList)restaurants);
        recyclerView.setAdapter(restaurantAdapter);
    }


    // end of Fragment
}
