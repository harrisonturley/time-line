package com.cpen321.cloutservices.timeline;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.cpen321.cloutservices.timeline.model.Award;
import com.cpen321.cloutservices.timeline.model.AwardDelegate;
import com.cpen321.cloutservices.timeline.model.User;
import com.cpen321.cloutservices.timeline.model.UserService;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AwardAdapter extends RecyclerView.Adapter<AwardAdapter.ViewHolder> {

    private ArrayList<Award> awards;
    private GoogleSignInAccount account;
    private int balance;
    private AwardDelegate delegate;

    public AwardAdapter(ArrayList<Award> awards, GoogleSignInAccount account, AwardDelegate delegate) { this.awards = awards; this.account = account; this.delegate = delegate; }

    @Override
    public AwardAdapter.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.award_row, viewGroup, false);
        getBalance(account);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(AwardAdapter.ViewHolder viewHolder, int i) {
        final int index = i;

        Glide.with(viewHolder.itemView.getContext()).load(awards.get(i).getURL()).into(viewHolder.awardImage);
        viewHolder.awardName.setText(awards.get(i).getName());
        viewHolder.awardCost.setText(String.valueOf(awards.get(i).getCost()));
        viewHolder.awardDescription.setText(awards.get(i).getDescription());

        // debugging start here
        viewHolder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // we check to see if we have enough balance if true, setup confirmation message, if false, send error message
                getBalance(account);

                AlertDialog.Builder builder = new AlertDialog.Builder(v.getContext());
                builder.setMessage("Do you wish to confirm this transaction?");
                builder.setCancelable(true);

                builder.setPositiveButton(
                        "Yes",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                // Write your code here to execute after dialog
                                if (balance < awards.get(i).getCost()) {
                                    Toast.makeText(v.getContext(), "You have insufficient balance", Toast.LENGTH_LONG).show();
                                    dialog.cancel();
                                }
                                else {
                                    Toast.makeText(v.getContext(), "Success! You have redeemed your award", Toast.LENGTH_LONG).show();
                                    balance = balance - awards.get(i).getCost();
//                                    awardsPoints.setText(balance);
                                    updateBalance(account, balance);
                                    dialog.cancel();
                                }
                            }
                        });

                builder.setNegativeButton(
                        "No",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int id) {
                                dialog.cancel();
                            }
                        });

                AlertDialog alert = builder.create();
                alert.show();


            }
        });
    }

    @Override
    public int getItemCount() {
        return awards.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        private View view;
        private ImageView awardImage;
        private TextView awardName;
        private TextView awardCost;
        private TextView awardDescription;

        public ViewHolder(View v) {
            super(v);
            view = v;
            awardImage = v.findViewById(R.id.awardImage);
            awardName = v.findViewById(R.id.awardName);
            awardCost = v.findViewById(R.id.awardCost);
            awardDescription = v.findViewById(R.id.awardDescription);
        }
    }

    private void getBalance(GoogleSignInAccount account) {
        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.getUserByEmail(account.getEmail());

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    balance = response.body().getBalance();
                    delegate.setPointsText(balance);
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
                    delegate.setPointsText(newBalance);
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

}
