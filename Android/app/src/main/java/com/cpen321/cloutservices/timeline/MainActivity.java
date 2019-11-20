package com.cpen321.cloutservices.timeline;

import androidx.appcompat.app.AppCompatActivity;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Lineup;
import com.cpen321.cloutservices.timeline.model.LineupService;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.cpen321.cloutservices.timeline.model.User;
import com.cpen321.cloutservices.timeline.model.UserService;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.tasks.Task;

import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;

import androidx.annotation.Nullable;

import java.util.List;

import mehdi.sakout.fancybuttons.FancyButton;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.http.Body;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public class MainActivity extends AppCompatActivity {

    private int RC_SIGN_IN = 0;
    private GoogleSignInClient mGoogleSignInClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        createNotificationChannel();
        FancyButton signIn = findViewById(R.id.sign_in_button);

        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile()
                .build();

        // Build a GoogleSignInClient with the options specified by gso.
        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        // global onclicklistener for the Main
        signIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                switch (v.getId()) {
                    case R.id.sign_in_button:
                        signIn();
                        break;
                    default: break;
                }
            }
        });
        // end of create
    }

    private void createNotificationChannel() {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = "Time Line Notification";
            String description = "Lineups provided by Time Line";
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel("TimeLineID", name, importance);
            channel.setDescription(description);
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    protected void onStart() {
        // Check for existing Google Sign In account, if the user is already signed in
        // the GoogleSignInAccount will be non-null.
        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);
        if (account != null) {
            verifyUser(account);
            startActivity(new Intent(MainActivity.this, SearchActivity.class));
        }
        else {
            Toast.makeText(MainActivity.this, "Please Sign In", Toast.LENGTH_LONG).show();
        }
        super.onStart();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            // The Task returned from this call is always completed, no need to attach
            // a listener
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    // handle the result of the sign in
    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            completedTask.getResult(ApiException.class);
            // Sign in successfully, show authenticated UI
            /* TODO: doublecheck this logic please */
            verifyUser(GoogleSignIn.getLastSignedInAccount(this));
            startActivity(new Intent(MainActivity.this, SearchActivity.class));
        } catch (ApiException e ) {
            // The ApiException status code indicates the detailed failure reason
            // Please refer to the GoogleSignInStatusCodes class reference for more information
            Log.w("Google Sign In Error", "signInResult:failed code=" + e.getStatusCode());
            Toast.makeText(MainActivity.this, "Failed", Toast.LENGTH_LONG).show();
        }
    }

    // sign in
    private void signIn() {
        Intent signInIntent = mGoogleSignInClient.getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }

    private void verifyUser(GoogleSignInAccount account) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
                Call<User> call = service.getUserByEmail(account.getEmail());

                call.enqueue(new Callback<User>() {
                    @Override
                    public void onResponse(Call<User> call, Response<User> response) {
                        if (response.isSuccessful()) {
                            /* empty body, this means account does not exist! */
                            System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                            if (response.body() == null) {
                                System.out.println("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                                createUser(account);
                            }
                            /* account exists */
                            else {
                                System.out.println("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
                                updateUser(account);
                            }
                        } else {    /* unnsuccessful response */
                            System.out.println("ERROR "+response.raw().body());
                            Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                        }
                    }
                    @Override
                    public void onFailure(Call<User> call, Throwable t) {
                        Log.wtf("Error", t.getMessage());
                    }
                });
            }   // end of run
        }).start();
    }   // end of verifyUser


    /* uses post method */
    public void createUser(GoogleSignInAccount account) {
        User user = new User();
        user.setEmail(account.getEmail());
        user.setName(account.getDisplayName());
        user.setBalance(0);

        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.postUser(user);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    // success!
                } else {
                    // failure!
                    System.out.println("ERROR "+response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                }
            }
            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.wtf("Error in createUser", t.getMessage());
            }
        });
    }   // end of createUser


    /* uses put method */
    public void updateUser(GoogleSignInAccount account) {
        User user = new User();
        user.setEmail(account.getEmail());
        user.setName(account.getDisplayName());

        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.putUserByEmail(account.getEmail(), user);

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    // success!
                } else {
                    // failure!
                    System.out.println("ERROR "+response.raw().body());
                    Log.wtf("Response errorBody", String.valueOf(response.errorBody()));
                }
            }
            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.wtf("Error in updateUser", t.getMessage());
            }
        });
    }   // end of updateUser

}   // end of MainActivity
