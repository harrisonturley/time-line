package com.cpen321.cloutservices.timeline.model;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

/*
 Define all API Calls
*/
public interface ApiService {

    //Post cart
    @POST("/lineups")
    Call<Lineup> sendLineupTime(@Body Lineup lineup);
}
