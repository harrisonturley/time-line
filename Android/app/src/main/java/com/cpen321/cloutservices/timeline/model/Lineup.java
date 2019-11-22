package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Lineup {

    @SerializedName("lineupTime")
    private double lineupTime;

    public void setLineupTime(Integer lineupTime) { this.lineupTime = (double)lineupTime; }

    public int getLineupTime() {
        return (int)lineupTime;
    }

}
