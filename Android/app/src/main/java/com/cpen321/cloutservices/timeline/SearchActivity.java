package com.cpen321.cloutservices.timeline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Notification;
import com.cpen321.cloutservices.timeline.model.NotificationService;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;


public class SearchActivity extends AppCompatActivity {

    private Toolbar toolbar;
    private DrawerLayout drawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        toolbar = findViewById(R.id.toolbar_main);
        drawer = findViewById(R.id.drawer_layout);

        configureToolbar();
    }

    private void configureToolbar() {
        setSupportActionBar(toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.app_name, R.string.app_name);
        drawer.addDrawerListener(toggle);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_menu_24px);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    public void onClickTestButton(View v) {
        FirebaseInstanceId.getInstance().getInstanceId()
            .addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
                @Override
                public void onComplete(@NonNull Task<InstanceIdResult> task) {
                    if (!task.isSuccessful()) {
                        Log.w("GET_INSTANCE_ID", "getInstanceId failed", task.getException());
                        return;
                    }

                    // Get new Instance ID token
                    String token = task.getResult().getToken();

                    // Log and toast
                    Log.d("GET_INSTANCE_ID", token);
                    Toast.makeText(SearchActivity.this, token, Toast.LENGTH_SHORT).show();

                    Notification notification = new Notification(token);
                    NotificationService notificationSub = RetrofitClientInstance.getRetrofitInstance().create(NotificationService.class);
                    Call<Notification> call = notificationSub.sendNotificationToken(notification);
                    call.enqueue(new Callback<Notification>() {
                        @Override
                        public void onResponse(Call<Notification> call, Response<Notification> response) {
                            Toast.makeText(SearchActivity.this, "Call sent", Toast.LENGTH_LONG).show();
                        }

                        @Override
                        public void onFailure(Call<Notification> call, Throwable t) {
                            Toast.makeText(SearchActivity.this, "Something went wrong...Please try later!", Toast.LENGTH_SHORT).show();
                        }
                    });
                }
            });
    }
}
