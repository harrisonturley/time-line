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

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.cpen321.cloutservices.timeline.model.Award;
import com.cpen321.cloutservices.timeline.model.Restaurant;
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
    private View awardsView;
    private TextView awardsPoints;
    private int balance;

    public AwardAdapter(ArrayList<Award> awards, GoogleSignInAccount accountId, View awardsView) { this.awards = awards; this.account = account; this.awardsPoints = awardsPoints; }

    @Override
    public AwardAdapter.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.search_row, viewGroup, false);

        awardsPoints = view.findViewById(R.id.award_points);
        awardsPoints.setText("555");

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(AwardAdapter.ViewHolder viewHolder, int i) {
        final int index = i;

        Glide.with(viewHolder.itemView.getContext()).load(awards.get(i).getURL()).into(viewHolder.awardImage);
        viewHolder.awardName.setText(awards.get(i).getName());
        viewHolder.awardCost.setText(awards.get(i).getCost());
        viewHolder.awardDescription.setText(awards.get(i).getDescription());

        viewHolder.view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // we check to see if we have enough balance
                // if true, setup confirmation message
                // if false, error message
                balance = getBalance(account);

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
                                    awardsPoints.setText(balance);
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

    private int getBalance(GoogleSignInAccount account) {
        UserService service = RetrofitClientHelper.getRetrofitInstance().create(UserService.class);
        Call<User> call = service.getUserByEmail(account.getEmail());

        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (response.isSuccessful()) {
                    balance = response.body().getUser().getBalance();
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
        return balance;
    }   // end of getBalance

    private int updateBalance(GoogleSignInAccount account, int balance) {
        User user = new User();
        user.setEmail(account.getEmail());
        user.setName(account.getDisplayName());
        user.setBalance(balance);

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
        return balance;
    }   // end of getBalance

}
