package com.cpen321.cloutservices.timeline;

import android.content.Intent;
import android.net.Uri;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.cpen321.cloutservices.timeline.model.Award;
import com.cpen321.cloutservices.timeline.model.Restaurant;
import com.squareup.picasso.Picasso;

import java.util.ArrayList;

public class AwardAdapter extends RecyclerView.Adapter<AwardAdapter.ViewHolder> {

    private ArrayList<Award> awards;

    public AwardAdapter(ArrayList<Award> awards) { this.awards = awards; }

    @Override
    public AwardAdapter.ViewHolder onCreateViewHolder(ViewGroup viewGroup, int i) {
        View view = LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.search_row, viewGroup, false);
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
}
