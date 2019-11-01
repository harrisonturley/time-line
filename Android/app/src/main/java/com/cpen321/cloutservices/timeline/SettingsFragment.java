package com.cpen321.cloutservices.timeline;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Notification;
import com.cpen321.cloutservices.timeline.model.NotificationService;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

public class SettingsFragment extends Fragment {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_settings, container, false);
        Button b = view.findViewById(R.id.settingsConnectButton);
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseInstanceId.getInstance().getInstanceId().addOnCompleteListener(new OnCompleteListener<InstanceIdResult>() {
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

                        Notification notification = new Notification(token);
                        NotificationService notificationSub = RetrofitClient.getRetrofitInstance().create(NotificationService.class);
                        Call<Notification> call = notificationSub.sendNotificationToken(notification);
                        call.enqueue(new Callback<Notification>() {
                            @Override
                            public void onResponse(Call<Notification> call, Response<Notification> response) {
                                Toast.makeText(getActivity(), "Call sent", Toast.LENGTH_LONG).show();
                            }

                            @Override
                            public void onFailure(Call<Notification> call, Throwable t) {
                                Toast.makeText(getActivity(), "Something went wrong...Please try later! " + t.getCause(), Toast.LENGTH_SHORT).show();

                            }
                        });
                    }
                });
            }
        });
        return view;
    }
}
