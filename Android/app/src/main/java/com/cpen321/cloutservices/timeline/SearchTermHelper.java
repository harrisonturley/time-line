package com.cpen321.cloutservices.timeline;

public class SearchTermHelper {
    private static String searchTerm;

    public static void setSearchTerm(String query) {
        searchTerm = query;
    }

    public static String getSearchTerm() {
        return searchTerm;
    }
}
