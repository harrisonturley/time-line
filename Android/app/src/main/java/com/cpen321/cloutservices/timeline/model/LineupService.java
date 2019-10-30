package com.cpen321.cloutservices.timeline.model;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

/*
 Define all API Calls
*/
public interface LineupService {

    @PUT("lineups/{id}")
    Call<Lineup>  updateLineup(@Path("id") String restaurantId, @Body Lineup lineup);

}
