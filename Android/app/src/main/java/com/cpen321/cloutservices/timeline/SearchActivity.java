package com.cpen321.cloutservices.timeline;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.drawerlayout.widget.DrawerLayout;

import android.os.Bundle;
import android.view.View;


public class SearchActivity extends AppCompatActivity {

    private Toolbar toolbar;
    private DrawerLayout drawer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        toolbar = findViewById(R.id.toolbar_main);
        drawer = findViewById(R.id.drawer_layout);

        configureToolbar();
    }

    private void configureToolbar() {
        setSupportActionBar(toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.app_name, R.string.app_name);
        drawer.addDrawerListener(toggle);
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_menu_24px);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    public void onClickTestButton(View v) {

    }
}
