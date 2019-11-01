package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Lineup {

    @SerializedName("lineupTime")
    private Integer lineupTime;

    public void setLineupTime(Integer lineupTime) { this.lineupTime = lineupTime; }

    public int getLineupTime() {
        return lineupTime;
    }

}
