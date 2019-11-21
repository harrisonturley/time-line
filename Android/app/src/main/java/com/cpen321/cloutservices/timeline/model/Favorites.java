package com.cpen321.cloutservices.timeline.model;

import com.google.gson.annotations.SerializedName;

import java.util.HashSet;
import java.util.Set;

public class Favorites {

    @SerializedName("favorites")
    private String[] favorites;

    public String[] getFavorites() {
        return favorites;
    }

    public String getFavoritesString() {
        return "";
    }

    public HashSet<String> getFavoritesSet() {
        HashSet<String> set = new HashSet<String>();

        for (String favorite: favorites) {
            set.add(favorite);
        }

        return set;
    }
}
