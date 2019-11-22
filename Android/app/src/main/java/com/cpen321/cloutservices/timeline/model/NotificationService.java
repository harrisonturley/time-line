package com.cpen321.cloutservices.timeline.model;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface NotificationService {
    @POST("notification/subscribe")
    Call<Notification> sendSubscribe(@Body Notification notification);

    @POST("notification/unsubscribe")
    Call<Notification> sendUnsubscribe(@Body Notification notification);
}
