package com.cpen321.cloutservices.timeline.model;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface FavoriteService {
    @GET("user/{email}/favorites")
    Call<Favorites> getUserFavorites(@Path("email") String email);

    @POST("user/{email}/favorites")
    Call<Favorites> postUserFavorite(@Path("email") String email, @Body Restaurant restaurant, @Body String registrationToken);

    @DELETE("user/{email}/favorties/{restaurantId}")
    Call<Favorites> deleteUserFavorite(@Path("email") String email, @Path("restaurantId") String restaurantId, @Body String registrationToken);

    @GET("search/restaurants/favorited")
    Call<Businesses> getRestaurantsFromIDs(@Query("restaurantIds") String restaurantIds);
}
