package com.cpen321.cloutservices.timeline;

import androidx.annotation.NonNull;
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
import com.cpen321.cloutservices.timeline.model.Coordinates;
import com.cpen321.cloutservices.timeline.model.FavoriteService;
import com.cpen321.cloutservices.timeline.model.Favorites;
import com.cpen321.cloutservices.timeline.model.LineupService;
import com.cpen321.cloutservices.timeline.model.Lineup;
import com.cpen321.cloutservices.timeline.model.Location;
import com.cpen321.cloutservices.timeline.model.PostFavoriteHelper;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.cpen321.cloutservices.timeline.model.User;
import com.cpen321.cloutservices.timeline.model.UserService;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

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
    private ImageView favoritedStar;
    // private double timer;
    private Handler handler;

    // Passed from RestaurantAdapter;
    private String restaurantId;
    private String restaurantName;
    private double restaurantLatitude;
    private double restaurantLongitude;
    private String[] fullAddress;
    private int seconds;
    private int minutes;
    private int milliseconds;
    private long millisecondTime;
    private long startTime;
    private long timeBuff;
    private long totalTime = 0L;
    private boolean isFavorited;

   // GoogleSignIn
    private GoogleSignInAccount account;
    private int balance;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_queue);

        /* findViews */
        TextView restaurantname = findViewById(R.id.restaurant_name);
        TextView restaurantaddress = findViewById(R.id.restaurant_address);
        ImageView restaurantimage = findViewById(R.id.restaurant_image);
        progressBar = findViewById(R.id.progressBar);
        toolbar = findViewById(R.id.toolbar_main);
        restaurantname = findViewById(R.id.restaurant_name);
        restaurantaddress = findViewById(R.id.restaurant_address);
        restaurantimage = findViewById(R.id.restaurant_image);
        queueTime = findViewById(R.id.queue_time);
        reportQueueBtn = findViewById(R.id.report_btn);
        favoritedStar = findViewById(R.id.favorites_star);

        /* retrieve restaurant from RestaurantAdapter */
        Intent intent = getIntent();
        restaurantId = intent.getStringExtra("id");
        String imageURL = intent.getStringExtra("img");
        String address = intent.getStringExtra("addr");
        fullAddress = intent.getStringArrayExtra("full_addr");
        restaurantName = intent.getStringExtra("name");
        restaurantLatitude = intent.getDoubleExtra("lat", 0);
        restaurantLongitude = intent.getDoubleExtra("long", 0);
        int distanceFromUser = intent.getIntExtra("distance", 0);
        int lineupTime = intent.getIntExtra("lineup", 0);
        isFavorited = intent.getBooleanExtra("isFavorited", false);

        handler = new Handler();

        configureToolbar();
        setFavoriteStar();

        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager().findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        restaurantname.setText(restaurantName);
        restaurantaddress.setText(address);
        queueTime.setText("00:00:00");
        reportQueueBtn.setChecked(false);    // start it as true
        Glide.with(ReportQueueActivity.this).load(imageURL).into(restaurantimage);
        account = GoogleSignIn.getLastSignedInAccount(this);

        favoritedStar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                isFavorited = !isFavorited;
                setFavoriteStar();
                Restaurant restaurant = new Restaurant(restaurantId, restaurantName, imageURL, distanceFromUser, lineupTime, new Coordinates(restaurantLatitude, restaurantLongitude), new Location(fullAddress));

                if (isFavorited) {
                    favoriteRestaurant(restaurant);
                } else {
                    unfavoriteRestaurant(restaurant);
                }
            }
        });

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

    private void setFavoriteStar() {
        if (isFavorited) {
            favoritedStar.setImageResource(R.drawable.ic_star_24px);
        } else {
            favoritedStar.setImageResource(R.drawable.ic_star_border_24px);
        }
    }

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
        GoogleMap mMap = googleMap;

        LatLng restaurant = new LatLng(restaurantLatitude, restaurantLongitude);
        mMap.addMarker(new MarkerOptions().position(restaurant).title(restaurantName));
        mMap.moveCamera(CameraUpdateFactory.newLatLng(restaurant));
        mMap.animateCamera(CameraUpdateFactory.zoomTo(ZOOM_LEVEL), ANIMATION_LENGTH, null);
    }

    // method to post the line up time
    public void putLineupTime(String restaurantId, int lineuptime) {
        // setup progess bar
        progressBar.setVisibility(View.VISIBLE);
        Log.wtf("Print restaurantId: ", restaurantId);

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

                    getBalance(account);
                    Toast.makeText(ReportQueueActivity.this, "You have submitted your lineup time", Toast.LENGTH_LONG).show();

                    // if not successful, object exists already. Update instead!
                }
                else {
                    System.out.println("ERROR "+response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                    Toast.makeText(ReportQueueActivity.this,  "Cannot submit new lineup time while submission is in progress", Toast.LENGTH_LONG).show();
                    progressBar.setVisibility(View.INVISIBLE);
                }

                onBackPressed();
            }

            @Override
            public void onFailure(Call<Lineup> call, Throwable t) {
                Toast.makeText(ReportQueueActivity.this, "You have submitted your lineup time", Toast.LENGTH_LONG).show();
                progressBar.setVisibility(View.INVISIBLE);
                Log.wtf("Error", t.getMessage());
                getBalance(account);
                onBackPressed();
            }
        });
    }

    private void favoriteRestaurant(Restaurant restaurant) {
        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w("GET_INSTANCE_ID", "failed to get firebase ID", task.getException());
                    return;
                }

                // Get new Instance ID token
                String token = task.getResult().getToken();
                Log.d("GET_INSTANCE_ID", token);

                FavoriteService favorites = RetrofitClientHelper.getRetrofitInstance().create(FavoriteService.class);
                PostFavoriteHelper helper = new PostFavoriteHelper(restaurant, token);
                Call<Favorites> postFavorite = favorites.postUserFavorite(GoogleSignIn.getLastSignedInAccount(ReportQueueActivity.this).getEmail(), helper);
                postFavorite.enqueue(new Callback<Favorites>() {
                    @Override
                    public void onResponse(Call<Favorites> call, Response<Favorites> response) {
                        Log.e("NOTIFICATION SUB", "Call sent");
                    }

                    @Override
                    public void onFailure(Call<Favorites> call, Throwable t) {
                        Log.e("NOTIFICATION SUB", "Possibly failed to subscribe, reason: " + t.getCause());
                    }
                });
            }
        });
    }

    private void unfavoriteRestaurant(Restaurant restaurant) {
        FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
            @Override
            public void onComplete(@NonNull Task<InstanceIdResult> task) {
                if (!task.isSuccessful()) {
                    Log.w("GET_INSTANCE_ID", "failed to get firebase ID", task.getException());
                    return;
                }

                // Get new Instance ID token
                String token = task.getResult().getToken();
                Log.d("GET_INSTANCE_ID", token);

                FavoriteService favorites = RetrofitClientHelper.getRetrofitInstance().create(FavoriteService.class);
                PostFavoriteHelper helper = new PostFavoriteHelper(null, token);
                Call<Favorites> deleteFavorite = favorites.deleteUserFavorite(GoogleSignIn.getLastSignedInAccount(ReportQueueActivity.this).getEmail(), restaurant.getId(), helper);
                deleteFavorite.enqueue(new Callback<Favorites>() {
                    @Override
                    public void onResponse(Call<Favorites> call, Response<Favorites> response) {
                        Log.e("NOTIFICATION SUB", "Call sent");
                    }

                    @Override
                    public void onFailure(Call<Favorites> call, Throwable t) {
                        Log.e("NOTIFICATION SUB", "Possibly failed to subscribe, reason: " + t.getCause());
                    }
                });
            }
        });
    }


    private void getBalance(GoogleSignInAccount account) {
        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.getUserByEmail(account.getEmail());

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    balance = response.body().getBalance();
                    updateBalance(account, balance + 200);
                }
                else {    /* unnsuccessful response */
                    System.out.println("ERROR " + response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.wtf("Error", t.getMessage());
            }
        });
    }   // end of getBalance

    private void updateBalance(GoogleSignInAccount account, int newBalance) {
        User user = new User();
        user.setEmail(account.getEmail());
        user.setName(account.getDisplayName());
        user.setBalance(newBalance);

        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.putUserByEmail(account.getEmail(), user);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    // success!
                }
                else {    /* unnsuccessful response */
                    // failure!
                    System.out.println("ERROR " + response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.wtf("Error", t.getMessage());
            }
        });
    }   // end of getBalance

    /* end of class */
}
