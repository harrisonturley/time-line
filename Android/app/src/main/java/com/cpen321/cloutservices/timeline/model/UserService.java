package com.cpen321.cloutservices.timeline.model;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

/*
 Define all API Calls
*/
public interface UserService {

    @GET("users/{email}")
    Call<User> getUserByEmail(@Path("email") String email);

    @POST("users")
    Call<User> postUser(@Body User user);

    @PUT("/users/{email}")
    Call<User> putUserByEmail(@Path("email") String email, @Body User user);

}
