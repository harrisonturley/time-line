package com.cpen321.cloutservices.timeline.model;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Query;

public interface RestaurantService {

    @GET("search/restaurants")
    Call<Businesses> getJSON(@Query("keyword") String keyword, @Query("latitude") double latitude, @Query("longitude") double longitude);

}
