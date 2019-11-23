package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Lineup {

    @SerializedName("lineupTime")
    private int lineupTime;

    public void setLineupTime(int lineupTime) { this.lineupTime = lineupTime; }

    public int getLineupTime() {
        return (int)lineupTime;
    }

}
