package com.cpen321.cloutservices.timeline;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.content.Context;
import android.graphics.Paint;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.cpen321.cloutservices.timeline.model.Notification;
import com.cpen321.cloutservices.timeline.model.NotificationService;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.navigation.NavigationView;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;


public class SearchActivity extends AppCompatActivity {

    private Toolbar toolbar;
    private DrawerLayout drawer;
    private Fragment mainFragment;
    private NavigationView navigationView;
    private View navigationHeaderView;
    private TextView navigationHeaderName;
    private TextView navigationHeaderEmail;
    private ImageView navigationHeaderImageView;
    private GoogleSignInAccount account;
    private Handler handler;

    private int navItemIndex;
    private String currentTag;

    private static final String TAG_SEARCH = "search";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search);

        toolbar = findViewById(R.id.toolbar_main);
        drawer = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.nav_view);
        navigationHeaderView = navigationView.getHeaderView(0);
        navigationHeaderName = navigationHeaderView.findViewById(R.id.nav_header_nameText);
        navigationHeaderEmail = navigationHeaderView.findViewById(R.id.nav_header_emailText);
        navigationHeaderImageView = navigationHeaderView.findViewById(R.id.nav_header_imageView);
        account = GoogleSignIn.getLastSignedInAccount(this);
        handler = new Handler();

        configureToolbar();
        configureNavigationView();

        if (savedInstanceState == null) {
            navItemIndex = 0;
            currentTag = TAG_SEARCH;
            Class fragmentClass = SearchFragment.class;

            try {
                mainFragment = (Fragment) fragmentClass.newInstance();
            } catch (Exception e) {
                e.printStackTrace();
            }

            loadHomeFragment();
        }
    }

    private void configureToolbar() {
        setSupportActionBar(toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawer, toolbar, R.string.app_name, R.string.app_name);
        drawer.addDrawerListener(toggle);
        toggle.syncState();
        getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_menu_24px);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
    }

    private void configureNavigationView() {
        if (account != null) {
            navigationHeaderName.setText(account.getDisplayName());
            navigationHeaderEmail.setText(account.getEmail());
            navigationHeaderEmail.setPaintFlags(navigationHeaderEmail.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);

            if (account.getPhotoUrl() != null) {
                navigationHeaderImageView.setImageURI(account.getPhotoUrl());
                Log.w("PHOTO", account.getPhotoUrl().toString());
            }
        }

        navigationView.setNavigationItemSelectedListener(new NavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                Class fragmentClass = null;
                int test = menuItem.getItemId();
                switch (menuItem.getItemId()) {
                    case R.id.nav_search:
                        fragmentClass = SearchFragment.class;
                        break;
                    case R.id.nav_settings:
                        fragmentClass = SettingsFragment.class;
                        break;
                }

                try {
                    mainFragment = (Fragment) fragmentClass.newInstance();
                } catch (Exception e) {
                    e.printStackTrace();
                }

                menuItem.setChecked(true);
                loadHomeFragment();
                return true;
            }
        });

        navigationView.setCheckedItem(R.id.nav_search);
    }

    private void loadHomeFragment() {
        Runnable pendingRunnable = new Runnable() {
            @Override
            public void run() {
                FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();
                //fragmentTransaction.setCustomAnimations(android.R.anim.fade_in, android.R.anim.fade_out);
                fragmentTransaction.replace(R.id.flContent, mainFragment);
                fragmentTransaction.commitAllowingStateLoss();
            }
        };

        if (pendingRunnable != null) {
            handler.post(pendingRunnable);
        }

        drawer.closeDrawers();
        invalidateOptionsMenu();
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if ( v instanceof EditText) {
                Rect outRect = new Rect();
                v.getGlobalVisibleRect(outRect);
                if (!outRect.contains((int)event.getRawX(), (int)event.getRawY())) {
                    v.clearFocus();
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                }
            }
        }
        return super.dispatchTouchEvent( event );
    }

    @Override
    public void onBackPressed() {
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawers();
        } else {
            super.onBackPressed();
        }
    }
}
