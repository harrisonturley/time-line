package com.cpen321.cloutservices.timeline;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ProgressBar;
import android.widget.ToggleButton;

import com.bumptech.glide.Glide;
import com.cpen321.cloutservices.timeline.model.LineupService;
import com.cpen321.cloutservices.timeline.model.Lineup;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.ArrayList;
import java.util.Arrays;

import androidx.appcompat.widget.Toolbar;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReportQueueActivity extends AppCompatActivity implements OnMapReadyCallback {
    private static final int ZOOM_LEVEL = 15;
    private static final int ANIMATION_LENGTH = 1000;
    private TextView queueTime;
    private TextView restaurantname;
    private TextView restaurantaddress;
    private ImageView restaurantimage;
    private ToggleButton reportQueueBtn;
    private ProgressBar progressBar;
    private GoogleMap mMap;
    private Toolbar toolbar;
    //    private double timer;
    private Handler handler;

    // Passed from RestaurantAdapter;
    private String restaurantId;
    private String restaurantName;
    private double restaurantLatitude;
    private double restaurantLongitude;
    private int seconds, minutes, milliseconds ;
    long millisecondTime, startTime, timeBuff, totalTime = 0L ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_queue);

        /* findViews */
        progressBar = findViewById(R.id.progressBar);
        toolbar = findViewById(R.id.toolbar_main);
        restaurantname = findViewById(R.id.restaurant_name);
        restaurantaddress = findViewById(R.id.restaurant_address);
        restaurantimage = findViewById(R.id.restaurant_image);
        queueTime = findViewById(R.id.queue_time);
        reportQueueBtn = findViewById(R.id.report_btn);

        /* retrieve restaurant from RestaurantAdapter */
        Intent intent = getIntent();
        restaurantId = intent.getStringExtra("id");
        String imageURL = intent.getStringExtra("img");
        String address = intent.getStringExtra("addr");
        restaurantName = intent.getStringExtra("name");
        restaurantLatitude = intent.getDoubleExtra("lat", 0);
        restaurantLongitude = intent.getDoubleExtra("long", 0);

        handler = new Handler();

        configureToolbar();

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        restaurantname.setText(restaurantName);
        restaurantaddress.setText(address);
        queueTime.setText("00:00:00");
        reportQueueBtn.setChecked(false);    // start it as true
        Glide.with(ReportQueueActivity.this).load(imageURL).into(restaurantimage);

        reportQueueBtn.setOnClickListener (new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                //... start calculation
                if (reportQueueBtn.isChecked()) {
                    // textOn="Start Queue"
                    startTime = SystemClock.uptimeMillis();
                    handler.postDelayed(runnable, 0);    // passing in 0, will make postDelayed run forever
                    // go back to search
                }
                else {   // textOff="End Queue"
                    // this is the resetting part but first send lineup to backend
                    putLineupTime(restaurantId, (int)totalTime);
                    millisecondTime = 0L ;
                    startTime = 0L ;
                    timeBuff = 0L ;
                    totalTime = 0L ;
                    seconds = 0 ;
                    minutes = 0 ;
                    milliseconds = 0 ;
                    queueTime.setText("00:00:00");
                    handler.removeCallbacks(runnable);
                    handler = null;
                    runnable = null;
                    onBackPressed();
                }
            }
        });

        // end of OnCreate
    }

    public Runnable runnable = new Runnable() {
        public void run() {
            millisecondTime = SystemClock.uptimeMillis() - startTime;
            totalTime = timeBuff + millisecondTime;
            seconds = (int) (totalTime / 1000);
            minutes = seconds / 60;
            seconds = seconds % 60;
            milliseconds = (int) (totalTime % 1000);
            queueTime.setText("" + minutes + ":"
                    + String.format("%02d", seconds) + ":"
                    + String.format("%03d", milliseconds));
            handler.postDelayed(this, 0);
        }
    };

    private void configureToolbar() {
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_arrow_back_24px);
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        LatLng restaurant = new LatLng(restaurantLatitude, restaurantLongitude);
        mMap.addMarker(new MarkerOptions().position(restaurant).title(restaurantName));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(restaurant));
        mMap.animateCamera(CameraUpdateFactory.zoomTo(ZOOM_LEVEL), ANIMATION_LENGTH, null);
    }

    // method to post the line up time
    public void putLineupTime(String restaurantId, Integer lineuptime) {
        // setup progess bar
        progressBar.setVisibility(View.VISIBLE);
        Log.wtf("Print restaurantId: ", restaurantId);
        Log.wtf("Print lineuptime: ", lineuptime.toString());

        Lineup lineup = new Lineup();
        lineup.setLineupTime(lineuptime);

        LineupService service = RetrofitClientHelper.getRetrofitInstance().create(LineupService.class);
        Call<Lineup> call = service.updateLineup(restaurantId, lineup);

        call.enqueue(new Callback<Lineup>() {
            @Override
            public void onResponse(Call<Lineup> call, Response<Lineup> response) {
                Log.wtf("Call request", call.request().toString());
                Log.wtf("Call request header", call.request().headers().toString());
                Log.wtf("Response raw header", response.headers().toString());
                Log.wtf("Response raw", String.valueOf(response.raw().body()));
                Log.wtf("Response code", String.valueOf(response.code()));

                //  object does not exist yet
                if (response.isSuccessful()) {
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(ReportQueueActivity.this, "You have submitted your lineup time", Toast.LENGTH_LONG).show();

                    // if not successful, object exists already. Update instead!
                } else {
                    System.out.println("ERROR "+response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                    Toast.makeText(ReportQueueActivity.this,  "Cannot submit new lineup time while submission is in progress", Toast.LENGTH_LONG).show();
                    progressBar.setVisibility(View.INVISIBLE);
                }
            }

            @Override
            public void onFailure(Call<Lineup> call, Throwable t) {
                Toast.makeText(ReportQueueActivity.this, "Failed to submit. Check your Internet connection", Toast.LENGTH_LONG).show();
                progressBar.setVisibility(View.INVISIBLE);
                Log.wtf("Error", t.getMessage());
            }
        });
    }
    /* end of class */
}
