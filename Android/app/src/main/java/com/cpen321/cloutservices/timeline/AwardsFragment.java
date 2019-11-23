package com.cpen321.cloutservices.timeline;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.cpen321.cloutservices.timeline.model.Award;
import com.cpen321.cloutservices.timeline.model.AwardDelegate;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;

import java.util.ArrayList;
import java.util.List;

public class AwardsFragment extends Fragment implements AwardDelegate {
    private RecyclerView recyclerView;
    private TextView awardsPoints;
    private GoogleSignInAccount account;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_awards, container, false);
        account = GoogleSignIn.getLastSignedInAccount(getActivity());
        configureAwardsView(view);
        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onDetach() {
        super.onDetach();
    }

    private void configureAwardsView(View v) {
        recyclerView = v.findViewById(R.id.award_recycler_view);
        awardsPoints = v.findViewById(R.id.award_points);

        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(layoutManager);

        List<Award>  awards = new ArrayList<Award>();
        awards.add( new Award( "https://news.mcdonalds.com/static-files/59507ede-6194-44cc-a232-c45e4154ce7f", "McDonald's", 1000, "Redeem 1000 points for a FREE Cheeseburger" ) );
        awards.add( new Award( "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/A%26W_Logo.svg/400px-A%26W_Logo.svg.png", "A&W", 3000, "Redeem 3000 points for a FREE Mama Burger" ) );
        awards.add( new Award( "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png", "Starbucks", 5000, "Redeem 5000 points for a FREE Java Chip Frappuccino" ) );
        awards.add( new Award( "https://www.tripleos.com/sites/default/files/TPLO15-Logo-Glow-effect.png", "Triple O's", 4000, "Redeem 4000 points for a FREE Chocolate Milkshake" ) );

        AwardAdapter awardAdapter = new AwardAdapter((ArrayList) awards, account,this);
        recyclerView.setAdapter(awardAdapter);
    }

    @Override
    public void setPointsText(int points) {
        awardsPoints.setText(String.valueOf(points));
    }

    @Override
    public void testText(String text) {
        awardsPoints.setText(text);
    }
    // end of Fragment
}
