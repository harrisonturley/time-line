package com.cpen321.cloutservices.timeline;

import android.app.Application;
import android.content.Context;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClientHelper extends Application {

    private static Retrofit retrofit;

    public static Retrofit getRetrofitInstance(Context context) {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                .baseUrl(context.getResources().getString(R.string.backendEndpoint))
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        }

        return retrofit;
    }
}
