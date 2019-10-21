package com.cpen321.cloutservices.timeline;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ProgressBar;

import com.bumptech.glide.Glide;
import com.cpen321.cloutservices.timeline.model.LineupService;
import com.cpen321.cloutservices.timeline.model.Lineup;
import com.squareup.picasso.Picasso;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReportQueueActivity extends AppCompatActivity {

    TextView restaurantname;
    TextView restaurantaddress;
    ImageView restaurantimage;
    EditText queueInput;
    Button submitQueueBtn;
    Integer lineuptime;
    ProgressBar progressBar;

    // Passed from RestaurantAdapter;
    String restaurantId;
    String imageURL;
    String address;
    String name;
    private static final String IMG = "img";
    private static final String ADDR = "addr";
    private static final String NAME = "name";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_queue);

        // findViews
        submitQueueBtn = findViewById(R.id.submit_btn);
        queueInput = findViewById(R.id.queue_input);
        progressBar = findViewById(R.id.progressBar);
        restaurantname = findViewById(R.id.restaurant_name);
        restaurantaddress = findViewById(R.id.restaurant_address);
        restaurantimage = findViewById(R.id.restaurant_image);


        /* retrieve restaurant from RestaurantAdapter */
        Intent intent = getIntent();
        restaurantId = intent.getStringExtra("id");
        imageURL = intent.getStringExtra("img");
        address = intent.getStringExtra("addr");
        name = intent.getStringExtra("name");


        restaurantname.setText(name);
        restaurantaddress.setText(address);
//        Picasso.get().load(imageURL).into(restaurantimage);
        Glide.with(ReportQueueActivity.this).load(imageURL).into(restaurantimage);

        submitQueueBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lineuptime = Integer.parseInt(queueInput.getText().toString());
                // send info to backend api call lets go
                putLineupTime(restaurantId, lineuptime);
                startActivity(new Intent(ReportQueueActivity.this, SearchActivity.class));
            }
        });
    }


    // method to post the line up time
    public void putLineupTime(String restaurantId, Integer lineuptime) {
        // setup progess bar
        progressBar.setVisibility(View.VISIBLE);
        Log.wtf("Print restaurantId: ", restaurantId);
        Log.wtf("Print lineuptime: ", lineuptime.toString());

        Lineup lineup = new Lineup();
        lineup.setLineupTime(lineuptime);

        LineupService service = RetrofitClientInstance.getRetrofitInstance().create(LineupService.class);
        Call<Lineup> call = service.updateLineup(restaurantId, lineup);

        call.enqueue(new Callback<Lineup>() {
            @Override
            public void onResponse(Call<Lineup> call, Response<Lineup> response) {
                // wtf is going on
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
/*
    // method to post the line up time -- not used anymore... kept for nostalgia
    public void postLineupTime(String restaurantId, Integer lineuptime) {
        // setup progess bar
        progressBar.setVisibility(View.VISIBLE);

        Lineup lineup = new Lineup(restaurantId, lineuptime);
        Log.wtf("Print restaurantId: ", restaurantId);
        Log.wtf("Print lineuptime: ", lineuptime.toString());
        LineupService service = RetrofitClientInstance.getRetrofitInstance().create(LineupService.class);
        Call<Lineup> call = service.addLineup(lineup);

        call.enqueue(new Callback<Lineup>() {
            @Override
            public void onResponse(Call<Lineup> call, Response<Lineup> response) {
                // wtf is going on
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
*/
    /* end of class */
}
