package com.cpen321.cloutservices.timeline;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ProgressBar;

import com.cpen321.cloutservices.timeline.model.ApiService;
import com.cpen321.cloutservices.timeline.model.Lineup;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReportQueueActivity extends AppCompatActivity {

    Bundle bundle;
    TextView restaurantname;
    EditText queueInput;
    Button submitQueueBtn;
    Integer lineuptime;
    String restaurantId;
    ApiService service;
    ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_report_queue);

        /*Create handle for the RetrofitInstance interface*/
        service = RetrofitClientInstance.getRetrofitInstance().create(ApiService.class);

        // findViews
        submitQueueBtn = findViewById(R.id.submit_btn);
        queueInput = findViewById(R.id.queue_input);
        progressBar = findViewById(R.id.progressBar);

        /* retrieve restaurant from search activity */
        bundle = getIntent().getExtras();
        restaurantId = bundle.getString("restaurantId");
        restaurantname.setText(restaurantId);

        submitQueueBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                lineuptime = Integer.parseInt(queueInput.getText().toString());
                // send info to backend api call lets go
                postLineupTime(restaurantId, lineuptime);
            }
        });
    }

    // method to post the line up time
    public void postLineupTime(String restaurantId, Integer lineuptime) {
        // setup progess bar
        progressBar.setVisibility(View.VISIBLE);

        Lineup lineup = new Lineup(restaurantId, lineuptime);
        Call<Lineup> call = service.sendLineupTime(lineup);

        call.enqueue(new Callback<Lineup>() {
            @Override
            public void onResponse(Call<Lineup> call, Response<Lineup> response) {

                if (response.isSuccessful()) {
                    progressBar.setVisibility(View.INVISIBLE);
                    Toast.makeText(ReportQueueActivity.this, "You have submitted your lineup time", Toast.LENGTH_LONG).show();


                } else {
                    Toast.makeText(ReportQueueActivity.this, "Cannot submit new lineup time while your previous time is in progress.", Toast.LENGTH_LONG).show();
                    progressBar.setVisibility(View.INVISIBLE);
                }
            }

            @Override
            public void onFailure(Call<Lineup> call, Throwable t) {

                Toast.makeText(ReportQueueActivity.this, "Failed to submit. Check your Internet connection", Toast.LENGTH_LONG).show();
                progressBar.setVisibility(View.INVISIBLE);

            }
        });
    }

/* end of class */
}
