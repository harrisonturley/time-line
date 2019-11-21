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
        StringBuilder sb = new StringBuilder();
        sb.append("[");

        for (String favorite: favorites) {
            sb.append("\"" + favorite + "\",");
        }

        sb.deleteCharAt(sb.length() - 1);
        sb.append("]");
        return sb.toString();
    }

    public HashSet<String> getFavoritesSet() {
        HashSet<String> set = new HashSet<String>();

        for (String favorite: favorites) {
            set.add(favorite);
        }

        return set;
    }
}
