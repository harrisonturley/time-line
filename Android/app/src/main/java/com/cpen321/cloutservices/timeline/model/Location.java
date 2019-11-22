package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

public class Location {

    @SerializedName("display_address")
    private String[] displayAddress;

    public Location(String[] displayAddress) {
        this.displayAddress = displayAddress;
    }

    public String[] getDisplayAddress() {
        return displayAddress;
    }

    public String getDisplayAddressFormatted() {
        String displayString = "";

        for (int i = 0; i < displayAddress.length - 1; i++) {
            displayString += displayAddress[i];

            if (i != displayAddress.length - 2) {
                displayString += ", ";
            }
        }

        return displayString;
    }
}
