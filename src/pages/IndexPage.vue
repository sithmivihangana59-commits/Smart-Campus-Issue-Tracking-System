<template>
  <q-page class="home-page">
    <!-- ================= NAVBAR ================= -->
    <header class="navbar">
      <div class="nav-container">
        <!-- LOGO -->
        <div class="brand" @click="scrollToTop">
          <div class="brand-icon">
            <q-icon name="school" size="22px" />
          </div>

          <div class="brand-text">
            <div class="brand-name">CAMPUSCARE</div>
            <div class="brand-subtitle">SMART CAMPUS</div>
          </div>
        </div>

        <!-- NAVIGATION -->
        <nav class="desktop-nav">
          <a
            href="#home"
            class="nav-link"
            :class="{ active: activeSection === 'home' }"
            @click.prevent="scrollToTop"
            >Home</a
          >
          <a
            href="#how-it-works"
            class="nav-link"
            :class="{ active: activeSection === 'how-it-works' }"
            @click.prevent="scrollToSection('how-it-works')"
            >How It Works</a
          >
          <a
            href="#features"
            class="nav-link"
            :class="{ active: activeSection === 'features' }"
            @click.prevent="scrollToSection('features')"
            >Features</a
          >
          <a
            href="#about"
            class="nav-link"
            :class="{ active: activeSection === 'about' }"
            @click.prevent="scrollToSection('about')"
            >About</a
          >
        </nav>

        <!-- NAV ACTIONS -->
        <div class="nav-actions">
          <div v-if="currentUser" class="user-nav-chip">
            <q-icon name="person" size="16px" color="primary" />
            <span>{{ currentUser.name || 'Student' }}</span>
          </div>

          <q-btn
            flat
            no-caps
            :label="currentUser ? 'Sign Out' : 'Login'"
            :icon="currentUser ? 'logout' : 'login'"
            class="login-btn"
            @click="handleLogin"
          />

          <q-btn
            unelevated
            no-caps
            label="Report Issue"
            icon-right="arrow_forward"
            class="nav-report-btn"
            @click="reportIssue"
          />

          <!-- Mobile Menu Button -->
          <q-btn
            flat
            round
            dense
            icon="menu"
            class="mobile-menu-btn"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>

      <!-- MOBILE NAV DRAWER -->
      <div v-if="mobileMenuOpen" class="mobile-nav-drawer">
        <a
          href="#home"
          class="mobile-nav-item"
          :class="{ active: activeSection === 'home' }"
          @click.prevent="closeMobileMenu(scrollToTop)"
        >
          <q-icon name="home" size="18px" />
          <span>Home</span>
        </a>
        <a
          href="#how-it-works"
          class="mobile-nav-item"
          :class="{ active: activeSection === 'how-it-works' }"
          @click.prevent="
            closeMobileMenu(() => scrollToSection('how-it-works'))
          "
        >
          <q-icon name="sync_alt" size="18px" />
          <span>How It Works</span>
        </a>
        <a
          href="#features"
          class="mobile-nav-item"
          :class="{ active: activeSection === 'features' }"
          @click.prevent="closeMobileMenu(() => scrollToSection('features'))"
        >
          <q-icon name="widgets" size="18px" />
          <span>Features</span>
        </a>
        <a
          href="#about"
          class="mobile-nav-item"
          :class="{ active: activeSection === 'about' }"
          @click.prevent="closeMobileMenu(() => scrollToSection('about'))"
        >
          <q-icon name="info" size="18px" />
          <span>About</span>
        </a>
        <div class="mobile-drawer-footer">
          <q-btn
            unelevated
            no-caps
            label="Report an Issue"
            icon="add_circle"
            class="mobile-report-btn"
            @click="closeMobileMenu(reportIssue)"
          />
        </div>
      </div>
    </header>

    <!-- ================= HERO ================= -->
    <section id="home" class="hero-section">
      <div class="hero-container">
        <!-- HERO LEFT -->
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Smart Campus Issue Management
          </div>

          <h1 class="hero-title">
            Make your campus
            <span>better.</span>
          </h1>

          <p class="hero-description">
            Report campus issues, track their progress, and stay connected with
            the people working to make your university a better place.
          </p>

          <div class="hero-buttons">
            <q-btn
              unelevated
              no-caps
              label="Report an Issue"
              icon="add_circle_outline"
              class="primary-btn"
              @click="reportIssue"
            />

            <q-btn
              flat
              no-caps
              label="Track an Issue"
              icon="search"
              class="secondary-btn"
              @click="openTrackModal()"
            />
          </div>

          <!-- TRUST -->
          <div class="hero-trust">
            <div class="trust-avatars">
              <div class="avatar avatar-1">S</div>
              <div class="avatar avatar-2">A</div>
              <div class="avatar avatar-3">K</div>

              <div class="avatar avatar-4">
                <q-icon name="add" size="15px" />
              </div>
            </div>

            <div class="trust-text">
              <strong>Built for campus communities</strong>
              <span>Students • Staff • Administration</span>
            </div>
          </div>
        </div>

        <!-- HERO RIGHT -->
        <div class="hero-visual">
          <div class="visual-glow"></div>

          <!-- DASHBOARD CARD -->
          <div class="dashboard-card">
            <!-- HEADER -->
            <div class="dashboard-header">
              <div>
                <span class="small-label"> CAMPUS OVERVIEW </span>

                <h3> Issue Management </h3>
              </div>

              <div class="live-indicator">
                <span></span>
                Live
              </div>
            </div>

            <!-- MINI STATS -->
            <div class="mini-stats">
              <div class="mini-stat">
                <div class="mini-icon blue">
                  <q-icon name="assignment" />
                </div>

                <div>
                  <strong>128</strong>
                  <span>Total Issues</span>
                </div>
              </div>

              <div class="mini-stat">
                <div class="mini-icon orange">
                  <q-icon name="pending_actions" />
                </div>

                <div>
                  <strong>24</strong>
                  <span>Pending</span>
                </div>
              </div>
            </div>

            <!-- PROGRESS -->
            <div class="progress-section">
              <div class="progress-top">
                <span>Resolution Progress</span>
                <strong>78%</strong>
              </div>

              <div class="progress-bar">
                <div class="progress-value"></div>
              </div>
            </div>

            <!-- ISSUE LIST -->
            <div class="issue-list">
              <!-- ISSUE 01 -->
              <div class="issue-item">
                <div class="issue-icon maintenance">
                  <q-icon name="build" />
                </div>

                <div class="issue-info">
                  <strong> Laboratory Equipment </strong>

                  <span> Engineering Faculty </span>
                </div>

                <div class="status resolved"> Resolved </div>
              </div>

              <!-- ISSUE 02 -->
              <div class="issue-item">
                <div class="issue-icon it">
                  <q-icon name="wifi" />
                </div>

                <div class="issue-info">
                  <strong> Wi-Fi Connectivity </strong>

                  <span> Main Library </span>
                </div>

                <div class="status progress"> In Progress </div>
              </div>

              <!-- ISSUE 03 -->
              <div class="issue-item">
                <div class="issue-icon facility">
                  <q-icon name="lightbulb" />
                </div>

                <div class="issue-info">
                  <strong> Classroom Lighting </strong>

                  <span> Science Faculty </span>
                </div>

                <div class="status pending"> Pending </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HERO BOTTOM FEATURES -->
      <div class="hero-bottom">
        <div class="bottom-item">
          <div class="bottom-icon">
            <q-icon name="verified_user" />
          </div>

          <div>
            <strong>Transparent</strong>
            <span>Track every report</span>
          </div>
        </div>

        <div class="bottom-item">
          <div class="bottom-icon">
            <q-icon name="bolt" />
          </div>

          <div>
            <strong>Efficient</strong>
            <span>Faster issue resolution</span>
          </div>
        </div>

        <div class="bottom-item">
          <div class="bottom-icon">
            <q-icon name="groups" />
          </div>

          <div>
            <strong>Connected</strong>
            <span>One campus community</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= HOW IT WORKS ================= -->
    <section id="how-it-works" class="section how-section">
      <div class="section-heading">
        <div class="section-tag"> SIMPLE PROCESS </div>

        <h2> From problem to solution. </h2>

        <p>
          A simple and transparent way to report campus problems and keep track
          of what happens next.
        </p>
      </div>

      <div class="steps-container">
        <!-- STEP 01 -->
        <div class="step-card clickable-card" @click="reportIssue">
          <div class="step-number"> 01 </div>

          <div class="step-icon">
            <q-icon name="edit_note" />
          </div>

          <h3> Report Issue </h3>

          <p>
            Submit an issue with location, category, priority, and description
            in just a few clicks.
          </p>

          <span class="step-link">
            Easy reporting
            <q-icon name="arrow_forward" />
          </span>
        </div>

        <!-- STEP 02 -->
        <div class="step-card clickable-card" @click="openRoleModal('Staff')">
          <div class="step-number"> 02 </div>

          <div class="step-icon">
            <q-icon name="assignment_ind" />
          </div>

          <h3> Review & Assign </h3>

          <p>
            Campus administrators review the report and assign it to dedicated
            maintenance or IT staff.
          </p>

          <span class="step-link">
            Staff dispatch
            <q-icon name="arrow_forward" />
          </span>
        </div>

        <!-- STEP 03 -->
        <div class="step-card clickable-card" @click="openTrackModal()">
          <div class="step-number"> 03 </div>

          <div class="step-icon">
            <q-icon name="visibility" />
          </div>

          <h3> Track Progress </h3>

          <p>
            Follow real-time status updates, remarks, and timeline progression
            on your dashboard.
          </p>

          <span class="step-link">
            Live updates
            <q-icon name="arrow_forward" />
          </span>
        </div>

        <!-- STEP 04 -->
        <div
          class="step-card clickable-card"
          @click="scrollToSection('features')"
        >
          <div class="step-number"> 04 </div>

          <div class="step-icon">
            <q-icon name="task_alt" />
          </div>

          <h3> Issue Resolved </h3>

          <p>
            Campus teams resolve the problem and mark the ticket complete,
            keeping university spaces in top shape.
          </p>

          <span class="step-link">
            Better campus
            <q-icon name="check" />
          </span>
        </div>
      </div>
    </section>

    <!-- ================= FEATURES ================= -->
    <section id="features" class="section features-section">
      <div class="section-heading">
        <div class="section-tag"> ONE PLATFORM </div>

        <h2> Everything your campus needs. </h2>

        <p>
          Designed to connect students, staff and administrators through one
          simple issue management platform.
        </p>
      </div>

      <div class="feature-grid">
        <!-- FEATURE 01 -->
        <div class="feature-card feature-blue" @click="reportIssue">
          <div class="feature-icon blue-bg">
            <q-icon name="report_problem" />
          </div>

          <h3> Report Campus Issues </h3>

          <p>
            Report maintenance, IT, facility and electrical problems quickly
            with building and room details.
          </p>

          <div class="feature-action">
            <span class="action-text">Report Issue</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>

        <!-- FEATURE 02 -->
        <div class="feature-card feature-green" @click="openTrackModal()">
          <div class="feature-icon green-bg">
            <q-icon name="timeline" />
          </div>

          <h3> Track Issue Status </h3>

          <p>
            Interactive multi-step status tracker showing progression from
            submission to assignment and resolution.
          </p>

          <div class="feature-action">
            <span class="action-text">Track Live</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>

        <!-- FEATURE 03 -->
        <div
          class="feature-card feature-purple"
          @click="openNotificationsModal()"
        >
          <div class="feature-icon purple-bg">
            <q-icon name="notifications_active" />
          </div>

          <h3> Real-time Updates </h3>

          <p>
            Stay informed with real-time status changes, timestamps, and
            comments directly from handling staff.
          </p>

          <div class="feature-action">
            <span class="action-text">View Updates</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>

        <!-- FEATURE 04 -->
        <div
          class="feature-card feature-orange"
          @click="openRoleModal('Staff')"
        >
          <div class="feature-icon orange-bg">
            <q-icon name="badge" />
          </div>

          <h3> Staff Assignment </h3>

          <p>
            Smart dispatching system for campus administrators to allocate
            issues to specialized technicians.
          </p>

          <div class="feature-action">
            <span class="action-text">Staff Portal</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>

        <!-- FEATURE 05 -->
        <div class="feature-card feature-cyan" @click="openTrackModal()">
          <div class="feature-icon cyan-bg">
            <q-icon name="history" />
          </div>

          <h3> Issue History & Logs </h3>

          <p>
            Complete chronological archive of all your reported issues, previous
            statuses, and resolution logs.
          </p>

          <div class="feature-action">
            <span class="action-text">View History</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>

        <!-- FEATURE 06 -->
        <div
          class="feature-card feature-indigo"
          @click="openRoleModal('Admin')"
        >
          <div class="feature-icon indigo-bg">
            <q-icon name="admin_panel_settings" />
          </div>

          <h3> Secure Role Access </h3>

          <p>
            Tailored workflows for Students, Staff, and Admins protected by
            secure JWT token authentication.
          </p>

          <div class="feature-action">
            <span class="action-text">Role Guide</span>
            <span class="feature-arrow">
              <q-icon name="arrow_forward" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= ABOUT ================= -->
    <section id="about" class="section about-section">
      <div class="section-heading">
        <div class="section-tag"> ABOUT CAMPUSCARE </div>

        <h2> Smart Campus Issue Management </h2>

        <p>
          CampusCare is a Smart Campus Issue Management System designed to help
          university students and staff report, manage, track, and resolve
          campus issues efficiently, bridging communication across the entire
          campus community.
        </p>
      </div>

      <!-- ABOUT HIGHLIGHT PILLARS -->
      <div class="about-grid">
        <div class="about-card">
          <div class="about-card-icon about-blue">
            <q-icon name="school" />
          </div>
          <h3>Student Empowerment</h3>
          <p>
            Empowers students to easily report classroom, hostel, lab, and
            facility issues with transparent progress tracking.
          </p>
        </div>

        <div class="about-card">
          <div class="about-card-icon about-green">
            <q-icon name="engineering" />
          </div>
          <h3>Staff Efficiency</h3>
          <p>
            Equips maintenance and technical staff with centralized issue
            queues, role assignment, and direct progress remarks.
          </p>
        </div>

        <div class="about-card">
          <div class="about-card-icon about-purple">
            <q-icon name="verified" />
          </div>
          <h3>Campus Excellence</h3>
          <p>
            Fosters a cleaner, safer, and smarter learning environment through
            speed, modern tech, and complete accountability.
          </p>
        </div>
      </div>

      <!-- CTA CONTAINER -->
      <div class="cta-container">
        <div class="cta-content">
          <div class="cta-icon">
            <q-icon name="school" />
          </div>

          <div>
            <span class="cta-label"> SMART CAMPUS INITIATIVE </span>

            <h2>
              Your campus.
              <span>Your voice.</span>
            </h2>

            <p>
              Help create a cleaner, safer and more connected university by
              reporting issues when you see them.
            </p>
          </div>
        </div>

        <q-btn
          unelevated
          no-caps
          label="Report an Issue"
          icon-right="arrow_forward"
          class="cta-btn"
          @click="reportIssue"
        />
      </div>
    </section>

    <!-- ================= FOOTER ================= -->
    <footer class="footer">
      <div class="footer-container">
        <!-- FOOTER BRAND -->
        <div class="footer-brand">
          <div class="brand">
            <div class="brand-icon">
              <q-icon name="school" size="20px" />
            </div>

            <div class="brand-text">
              <div class="brand-name"> CAMPUSCARE </div>

              <div class="brand-subtitle"> SMART CAMPUS </div>
            </div>
          </div>

          <p> A smarter way to build a better campus. </p>
        </div>

        <!-- FOOTER LINKS -->
        <div class="footer-links">
          <div class="footer-column">
            <h4> Platform </h4>

            <a href="#features" @click.prevent="scrollToSection('features')">
              Features
            </a>

            <a
              href="#how-it-works"
              @click.prevent="scrollToSection('how-it-works')"
            >
              How It Works
            </a>

            <a href="#about" @click.prevent="scrollToSection('about')">
              About
            </a>
          </div>

          <div class="footer-column">
            <h4> Support </h4>

            <a href="#" @click.prevent="openHelpModal('Help Center')">
              Help Center
            </a>

            <a href="#" @click.prevent="openHelpModal('Contact Us')">
              Contact Us
            </a>

            <a href="#" @click.prevent="openHelpModal('Privacy Policy')">
              Privacy
            </a>
          </div>

          <div class="footer-column">
            <h4> Campus </h4>

            <a href="#" @click.prevent="openRoleModal('Students')">
              Students
            </a>

            <a href="#" @click.prevent="openRoleModal('Staff')"> Staff </a>

            <a href="#" @click.prevent="openRoleModal('Administration')">
              Administration
            </a>
          </div>
        </div>
      </div>

      <!-- FOOTER BOTTOM -->
      <div class="footer-bottom">
        <span> © 2026 CampusCare. Smart Campus Issue Tracking System. </span>

        <span> Built for a better campus. </span>
      </div>
    </footer>

    <!-- ================= TRACK ISSUE MODAL ================= -->
    <q-dialog v-model="trackModalOpen" backdrop-filter="blur(12px)">
      <div class="track-modal-card">
        <!-- HEADER -->
        <div class="track-modal-header">
          <div class="header-left">
            <div class="modal-badge">
              <q-icon name="timeline" size="14px" />
              Live Issue Tracking
            </div>
            <h3>Track Your Campus Report</h3>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="modal-close"
            v-close-popup
          />
        </div>

        <!-- SEARCH BAR -->
        <div class="track-search-box">
          <div class="search-input-wrap">
            <q-icon name="search" class="search-icon" />
            <input
              v-model="searchRef"
              type="text"
              placeholder="Enter Reference ID (e.g. CC128492)"
              @keyup.enter="searchIssue"
            />
            <button class="search-btn" @click="searchIssue"> Track </button>
          </div>

          <!-- QUICK CHIPS / MY ISSUES -->
          <div class="sample-chips">
            <span class="chips-label">My Reported Issues:</span>

            <div
              v-if="loadingIssues"
              style="
                font-size: 12px;
                color: #94a3b8;
                padding: 4px 0;
                display: flex;
                align-items: center;
                gap: 6px;
              "
            >
              <q-spinner size="14px" color="primary" /> Loading issues...
            </div>

            <div
              v-else-if="issuesError"
              style="font-size: 12px; color: #ef4444; padding: 4px 0"
            >
              {{ issuesError }}
            </div>

            <div
              v-else-if="myIssues.length === 0"
              style="font-size: 12px; color: #64748b; padding: 4px 0"
            >
              No reported issues found.
              <a
                href="#"
                style="
                  color: #2563eb;
                  font-weight: 600;
                  text-decoration: underline;
                "
                @click.prevent="reportIssue"
                v-close-popup
                >Report an issue now</a
              >
            </div>

            <template v-else>
              <button
                v-for="item in myIssues"
                :key="item.id"
                class="sample-chip"
                :class="{
                  active: currentTrackIssue && currentTrackIssue.id === item.id
                }"
                @click="selectSampleIssue(item)"
              >
                #{{ item.id }}
              </button>
            </template>
          </div>
        </div>

        <!-- ISSUE STATUS CARD -->
        <div v-if="currentTrackIssue" class="track-details-box">
          <div class="details-top">
            <div>
              <div class="issue-ref-tag">
                Reference: <strong>#{{ currentTrackIssue.id }}</strong>
              </div>
              <h4 class="track-issue-title">{{ currentTrackIssue.title }}</h4>
              <div class="track-issue-meta">
                <span
                  ><q-icon name="location_on" size="14px" />
                  {{ currentTrackIssue.location }}</span
                >
                <span
                  ><q-icon name="schedule" size="14px" />
                  {{ currentTrackIssue.date }}</span
                >
                <span v-if="currentTrackIssue.category"
                  ><q-icon name="folder" size="14px" />
                  {{ currentTrackIssue.category }}</span
                >
                <span v-if="currentTrackIssue.priority"
                  ><q-icon name="flag" size="14px" />
                  {{ currentTrackIssue.priority }} Priority</span
                >
              </div>
            </div>

            <div
              class="track-status-pill"
              :class="currentTrackIssue.status.toLowerCase().replace(' ', '-')"
            >
              <span class="status-dot"></span>
              {{ currentTrackIssue.status }}
            </div>
          </div>

          <div v-if="currentTrackIssue.imageUrl" class="track-evidence">
            <div class="evidence-label">Photo Evidence</div>
            <a
              :href="currentTrackIssue.imageUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                :src="currentTrackIssue.imageUrl"
                alt="Issue photo evidence"
              />
              <span>Open photo</span>
            </a>
          </div>

          <!-- TIMELINE STEPS / STAFF UPDATES -->
          <div class="track-timeline">
            <div
              v-if="loadingTrackUpdates"
              style="
                font-size: 13px;
                color: #94a3b8;
                padding: 12px 0;
                text-align: center;
              "
            >
              <q-spinner size="18px" color="primary" class="q-mr-xs" /> Loading
              updates...
            </div>

            <template
              v-else-if="currentTrackUpdates && currentTrackUpdates.length > 0"
            >
              <div
                v-for="(up, idx) in currentTrackUpdates"
                :key="up._id || idx"
                class="timeline-node completed"
              >
                <div class="node-marker">
                  <q-icon name="check" size="13px" />
                </div>
                <div class="node-content">
                  <div class="node-title-row">
                    <strong>{{ up.status }}</strong>
                    <span class="node-time">{{
                      formatDate(up.createdAt)
                    }}</span>
                  </div>
                  <p>{{ up.message }}</p>
                  <div
                    v-if="up.updatedBy?.name"
                    style="font-size: 11px; color: #64748b; margin-top: 4px"
                  >
                    <q-icon name="person" size="12px" /> {{ up.updatedBy.name }}
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div
                v-for="(st, idx) in currentTrackIssue.steps"
                :key="idx"
                class="timeline-node"
                :class="{
                  completed: st.done,
                  current: st.current,
                  pending: !st.done && !st.current
                }"
              >
                <div class="node-marker">
                  <q-icon v-if="st.done" name="check" size="13px" />
                  <span v-else-if="st.current" class="pulse-ring"></span>
                  <span v-else>{{ idx + 1 }}</span>
                </div>
                <div class="node-content">
                  <div class="node-title-row">
                    <strong>{{ st.label }}</strong>
                    <span class="node-time">{{ st.time }}</span>
                  </div>
                  <p>{{ st.desc }}</p>
                </div>
              </div>

              <div
                style="
                  font-size: 12px;
                  color: #64748b;
                  text-align: center;
                  margin-top: 12px;
                  font-style: italic;
                "
              >
                No staff updates yet.
              </div>
            </template>
          </div>

          <!-- ACTION FOOTER -->
          <div class="track-modal-actions">
            <q-btn
              unelevated
              no-caps
              label="Report Another Issue"
              icon="add_circle"
              class="modal-report-btn"
              @click="reportIssue"
              v-close-popup
            />
            <q-btn
              flat
              no-caps
              label="Close"
              class="modal-dismiss-btn"
              v-close-popup
            />
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- ================= INFO / SUPPORT / UPDATES MODAL ================= -->
    <q-dialog v-model="infoModalOpen" backdrop-filter="blur(12px)">
      <div class="info-modal-card">
        <div class="track-modal-header">
          <div class="header-left">
            <div class="modal-badge">
              <q-icon name="school" size="14px" />
              Campus Care Information
            </div>
            <h3>{{ infoModalTitle }}</h3>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            class="modal-close"
            v-close-popup
          />
        </div>

        <div v-if="infoModalType === 'support'" class="info-modal-body">
          <div class="info-box-item">
            <div class="info-box-icon"><q-icon name="headset_mic" /></div>
            <div>
              <strong>Campus Emergency &amp; Maintenance Hotline</strong>
              <p>+94 11 234 5678 (24/7 Helpline)</p>
            </div>
          </div>

          <div class="info-box-item">
            <div class="info-box-icon"><q-icon name="mail" /></div>
            <div>
              <strong>Support Email</strong>
              <p>support@campuscare.ac.lk &bull; response within 2 hours</p>
            </div>
          </div>

          <div class="info-box-item">
            <div class="info-box-icon"><q-icon name="apartment" /></div>
            <div>
              <strong>Administrative Center</strong>
              <p>Ground Floor, Administration Complex, Room A-102</p>
            </div>
          </div>

          <div class="info-box-item">
            <div class="info-box-icon"><q-icon name="access_time" /></div>
            <div>
              <strong>Service Hours</strong>
              <p>Monday &ndash; Friday: 8:00 AM &ndash; 5:00 PM</p>
            </div>
          </div>
        </div>

        <div
          v-else-if="infoModalType === 'notifications'"
          class="info-modal-body"
        >
          <div class="alert-item live-alert">
            <div class="alert-indicator"></div>
            <div>
              <strong>Library Wi-Fi Maintenance</strong>
              <p
                >Technician team dispatched to Block A &amp; Library for access
                point upgrade.</p
              >
              <span class="alert-time">10 mins ago</span>
            </div>
          </div>

          <div class="alert-item resolved-alert">
            <div class="alert-indicator"></div>
            <div>
              <strong>Engineering Faculty Power Restore</strong>
              <p
                >Transformer maintenance completed; power fully restored to
                Labs.</p
              >
              <span class="alert-time">2 hours ago</span>
            </div>
          </div>

          <div class="alert-item info-alert">
            <div class="alert-indicator"></div>
            <div>
              <strong>Scheduled Campus Cleaning</strong>
              <p
                >All faculty lecture halls scheduled for deep sanitization this
                Saturday.</p
              >
              <span class="alert-time">Yesterday</span>
            </div>
          </div>
        </div>

        <div v-else class="info-modal-body">
          <p class="role-desc">
            CampusCare connects students, staff, and administration into one
            unified issue management ecosystem.
          </p>
          <ul class="role-list">
            <li
              ><q-icon name="check_circle" /> Submit immediate reports with
              location &amp; photo evidence</li
            >
            <li
              ><q-icon name="check_circle" /> Monitor real-time resolution
              stages with live SMS &amp; web tracking</li
            >
            <li
              ><q-icon name="check_circle" /> Verify and provide feedback once
              issues are marked as resolved</li
            >
          </ul>
        </div>

        <div class="track-modal-actions" style="margin-top: 24px">
          <q-btn
            unelevated
            no-caps
            label="Report an Issue"
            icon="arrow_forward"
            class="modal-report-btn"
            @click="reportIssue"
            v-close-popup
          />
          <q-btn
            flat
            no-caps
            label="Done"
            class="modal-dismiss-btn"
            v-close-popup
          />
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  getIssueImageUrl,
  getMyIssues,
  getIssueUpdates
} from '@/services/issueService'

const router = useRouter()

const activeSection = ref('home')
const mobileMenuOpen = ref(false)

const myIssues = ref([])
const loadingIssues = ref(false)
const issuesError = ref('')

const trackModalOpen = ref(false)
const searchRef = ref('')
const currentTrackIssue = ref(null)

const currentTrackUpdates = ref([])
const loadingTrackUpdates = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function loadTrackUpdates(mongoId) {
  if (!mongoId) {
    currentTrackUpdates.value = []
    return
  }
  loadingTrackUpdates.value = true
  try {
    const data = await getIssueUpdates(mongoId)
    currentTrackUpdates.value = Array.isArray(data) ? data : data.updates || []
  } catch {
    currentTrackUpdates.value = []
  } finally {
    loadingTrackUpdates.value = false
  }
}

function buildSteps(status, dateStr) {
  const isPending = status === 'Pending'
  const isInProgress = status === 'In Progress'
  const isResolved = status === 'Resolved'
  const isRejected = status === 'Rejected'

  return [
    {
      label: 'Issue Submitted',
      desc: 'Report logged by student',
      time: dateStr,
      done: true
    },
    {
      label: 'Under Review',
      desc: isPending ? 'Waiting for admin review' : 'Reviewed by campus admin',
      time: isPending ? 'In Progress' : 'Done',
      current: isPending,
      done: !isPending
    },
    {
      label: isRejected ? 'Rejected' : 'In Progress',
      desc: isRejected
        ? 'Report reviewed and rejected'
        : isInProgress
          ? 'Technician assigned & working'
          : isResolved
            ? 'Work completed'
            : 'Pending action',
      time: isInProgress
        ? 'In Progress'
        : isResolved || isRejected
          ? 'Done'
          : 'Pending',
      current: isInProgress || isRejected,
      done: isResolved || isRejected
    },
    {
      label: isRejected ? 'Case Closed' : 'Resolved & Closed',
      desc: isResolved
        ? 'Issue verified and resolved'
        : isRejected
          ? 'Issue marked as rejected'
          : 'Final resolution pending',
      time: isResolved || isRejected ? 'Completed' : 'Pending',
      done: isResolved || isRejected,
      current: false
    }
  ]
}

function mapIssue(raw) {
  const formattedDate = raw.createdAt
    ? new Date(raw.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently'

  const refId = raw._id
    ? raw._id.slice(-8).toUpperCase()
    : 'CC' + Math.floor(100000 + Math.random() * 900000)

  return {
    id: refId,
    mongoId: raw._id,
    title: raw.title || 'Campus Issue',
    category: raw.category || 'General',
    building: raw.building || '',
    room: raw.room || '',
    location: `${raw.building || 'Campus'}${raw.room ? ' - ' + raw.room : ''}`,
    priority: raw.priority || 'Medium',
    status: raw.status || 'Pending',
    date: formattedDate,
    description: raw.description || '',
    imageUrl: getIssueImageUrl(raw.image),
    steps: buildSteps(raw.status || 'Pending', formattedDate)
  }
}

async function fetchUserIssues() {
  loadingIssues.value = true
  issuesError.value = ''
  try {
    const data = await getMyIssues()
    const rawList = Array.isArray(data) ? data : data.issues || []
    myIssues.value = rawList.map(mapIssue)
    if (myIssues.value.length > 0) {
      if (
        !currentTrackIssue.value ||
        !myIssues.value.some(i => i.id === currentTrackIssue.value.id)
      ) {
        currentTrackIssue.value = myIssues.value[0]
        searchRef.value = myIssues.value[0].id
        if (myIssues.value[0].mongoId) {
          loadTrackUpdates(myIssues.value[0].mongoId)
        }
      }
    } else {
      currentTrackIssue.value = null
      searchRef.value = ''
    }
  } catch (err) {
    issuesError.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to load your issues.'
  } finally {
    loadingIssues.value = false
  }
}

const currentUser = ref(null)

function handleScroll() {
  const scrollY = window.scrollY
  const aboutEl = document.getElementById('about')
  const featEl = document.getElementById('features')
  const howEl = document.getElementById('how-it-works')

  const offset = 140
  if (aboutEl && scrollY >= aboutEl.offsetTop - offset) {
    activeSection.value = 'about'
  } else if (featEl && scrollY >= featEl.offsetTop - offset) {
    activeSection.value = 'features'
  } else if (howEl && scrollY >= howEl.offsetTop - offset) {
    activeSection.value = 'how-it-works'
  } else {
    activeSection.value = 'home'
  }
}

onMounted(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch {
      currentUser.value = null
    }
  }
  fetchUserIssues()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function openTrackModal(refId) {
  trackModalOpen.value = true
  fetchUserIssues()
  if (refId) {
    searchRef.value = refId
    searchIssue()
  }
}

function selectSampleIssue(issue) {
  currentTrackIssue.value = issue
  searchRef.value = issue.id
  if (issue.mongoId) {
    loadTrackUpdates(issue.mongoId)
  } else {
    currentTrackUpdates.value = []
  }
}

function searchIssue() {
  const query = searchRef.value.trim().toUpperCase().replace('#', '')
  if (!query) return

  const found = myIssues.value.find(
    i =>
      i.id.toUpperCase() === query ||
      (i.mongoId && i.mongoId.toUpperCase().endsWith(query))
  )

  if (found) {
    currentTrackIssue.value = found
    if (found.mongoId) loadTrackUpdates(found.mongoId)
  } else {
    currentTrackUpdates.value = []
    currentTrackIssue.value = {
      id: query,
      title: 'Searched Report',
      category: 'General Campus',
      location: 'Campus Premises',
      priority: 'Medium',
      status: 'Pending',
      date: 'Recent',
      steps: buildSteps('Pending', 'Recent')
    }
  }
}

// Info / Support / Roles modal state
const infoModalOpen = ref(false)
const infoModalTitle = ref('')
const infoModalType = ref('')

function openHelpModal(type) {
  infoModalTitle.value = type
  infoModalType.value = 'support'
  infoModalOpen.value = true
}

function openRoleModal(role) {
  infoModalTitle.value = `${role} Portal & Guide`
  infoModalType.value = 'role'
  infoModalOpen.value = true
}

function openNotificationsModal() {
  infoModalTitle.value = 'Campus Alerts & Real-time Updates'
  infoModalType.value = 'notifications'
  infoModalOpen.value = true
}

function scrollToSection(id) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    const navbarHeight = 72
    const targetY =
      el.getBoundingClientRect().top + window.pageYOffset - navbarHeight
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    })
  }
}

function scrollToTop() {
  activeSection.value = 'home'
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function closeMobileMenu(action) {
  action()
  mobileMenuOpen.value = false
}

function reportIssue() {
  router.push('/report-issue')
}

function handleLogin() {
  if (currentUser.value) {
    signOut()
  } else {
    router.push('/login')
  }
}

function signOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentUser.value = null
  router.push('/login')
}
</script>

<style scoped>
/* =====================================================
   BASE
===================================================== */

.home-page {
  width: 100%;
  min-height: 100vh;

  background: #f1f5f9;

  color: #0f172a;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;

  overflow-x: hidden;
}

/* =====================================================
   NAVBAR
===================================================== */

.navbar {
  position: sticky;

  top: 0;

  z-index: 1000;

  height: 76px;

  background: rgba(255, 255, 255, 0.96);

  backdrop-filter: blur(18px);

  border-bottom: 1px solid #e8edf3;
}

.nav-container {
  width: 100%;
  max-width: 1240px;

  height: 100%;

  margin: auto;

  padding: 0 28px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  justify-content: space-between;
}

/* BRAND */

.brand {
  display: flex;

  align-items: center;

  gap: 11px;

  cursor: pointer;
}

.brand-icon {
  width: 42px;
  height: 42px;

  flex-shrink: 0;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);

  color: white;

  box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3);
}

.brand-name {
  font-size: 15px;

  font-weight: 800;

  letter-spacing: 0.8px;

  color: #0f172a;
}

.brand-subtitle {
  margin-top: 2px;

  font-size: 8px;

  font-weight: 700;

  letter-spacing: 1.8px;

  color: #64748b;
}

/* NAV */

.desktop-nav {
  display: flex;

  align-items: center;

  gap: 34px;
}

.nav-link {
  position: relative;

  color: #475569;

  text-decoration: none;

  font-size: 14px;

  font-weight: 600;

  transition: 0.25s;
}

.nav-link:hover,
.nav-link.active {
  color: #1e40af;
}

.nav-link.active::after {
  content: '';

  position: absolute;

  left: 0;
  right: 0;

  bottom: -10px;

  height: 2px;

  background: #1e40af;

  border-radius: 10px;
}

/* ACTIONS */

.nav-actions {
  display: flex;

  align-items: center;

  gap: 8px;
}

.login-btn {
  color: #334155;

  font-weight: 600;
}

.nav-report-btn {
  min-height: 42px;

  padding: 0 18px;

  border-radius: 10px;

  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);

  color: white;

  font-weight: 700;

  box-shadow: 0 7px 18px rgba(30, 64, 175, 0.28);
}

/* =====================================================
   HERO
===================================================== */

.hero-section {
  position: relative;

  background:
    radial-gradient(
      circle at 80% 25%,
      rgba(30, 64, 175, 0.12),
      transparent 35%
    ),
    radial-gradient(
      circle at 10% 80%,
      rgba(37, 99, 235, 0.06),
      transparent 30%
    ),
    #f1f5f9;
}

.hero-container {
  width: 100%;
  max-width: 1240px;

  min-height: 610px;

  margin: auto;

  padding: 90px 28px 55px;

  box-sizing: border-box;

  display: grid;

  grid-template-columns: 1fr 0.92fr;

  align-items: center;

  gap: 70px;
}

/* HERO LEFT */

.hero-content {
  max-width: 610px;
}

.hero-badge {
  display: inline-flex;

  align-items: center;

  gap: 9px;

  padding: 8px 13px;

  border-radius: 30px;

  background: #dbeafe;

  color: #1e40af;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.3px;

  margin-bottom: 22px;
}

.badge-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #1e40af;

  box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.15);
}

.hero-title {
  margin: 0;

  font-size: clamp(50px, 5vw, 76px);

  line-height: 0.98;

  letter-spacing: -3.5px;

  font-weight: 850;

  color: #0f172a;
}

.hero-title span {
  display: block;

  background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  max-width: 540px;

  margin: 28px 0 30px;

  color: #475569;

  font-size: 17px;

  line-height: 1.75;
}

/* BUTTONS */

.hero-buttons {
  display: flex;

  align-items: center;

  gap: 12px;
}

.primary-btn {
  min-height: 52px;

  padding: 0 22px;

  border-radius: 11px;

  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);

  color: white;

  font-size: 14px;

  font-weight: 700;

  box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
}

.secondary-btn {
  min-height: 52px;

  padding: 0 20px;

  border-radius: 11px;

  color: #1e3a5f;

  font-weight: 700;
}

/* TRUST */

.hero-trust {
  margin-top: 34px;

  display: flex;

  align-items: center;

  gap: 13px;
}

.trust-avatars {
  display: flex;
}

.avatar {
  width: 30px;
  height: 30px;

  border-radius: 50%;

  margin-left: -7px;

  border: 2px solid #f8fafc;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 10px;

  font-weight: 800;

  background: #dbeafe;

  color: #1d4ed8;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-2 {
  background: #e0e7ff;

  color: #4338ca;
}

.avatar-3 {
  background: #dcfce7;

  color: #15803d;
}

.avatar-4 {
  background: #0f4cdb;

  color: white;
}

.trust-text {
  display: flex;

  flex-direction: column;

  gap: 2px;
}

.trust-text strong {
  font-size: 12px;

  color: #334155;
}

.trust-text span {
  font-size: 11px;

  color: #94a3b8;
}

/* =====================================================
   HERO VISUAL
===================================================== */

.hero-visual {
  position: relative;

  min-height: 460px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.visual-glow {
  position: absolute;

  width: 370px;
  height: 370px;

  border-radius: 50%;

  background: rgba(37, 99, 235, 0.09);

  filter: blur(30px);
}

/* DASHBOARD */

.dashboard-card {
  position: relative;

  width: min(480px, 100%);

  padding: 25px;

  box-sizing: border-box;

  border-radius: 20px;

  background: rgba(255, 255, 255, 0.98);

  border: 1px solid #e2e8f0;

  box-shadow:
    0 30px 70px rgba(15, 23, 42, 0.12),
    0 8px 20px rgba(15, 23, 42, 0.04);

  z-index: 2;
}

.dashboard-header {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  margin-bottom: 22px;
}

.small-label {
  color: #94a3b8;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.5px;
}

.dashboard-header h3 {
  margin: 5px 0 0;

  font-size: 20px;

  color: #12233f;
}

.live-indicator {
  display: flex;

  align-items: center;

  gap: 6px;

  padding: 6px 9px;

  border-radius: 20px;

  background: #ecfdf5;

  color: #15803d;

  font-size: 10px;

  font-weight: 700;
}

.live-indicator span {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #22c55e;
}

/* MINI STATS */

.mini-stats {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

  margin-bottom: 22px;
}

.mini-stat {
  padding: 15px;

  display: flex;

  align-items: center;

  gap: 11px;

  background: #f8fafc;

  border: 1px solid #edf2f7;

  border-radius: 12px;
}

.mini-icon {
  width: 38px;
  height: 38px;

  border-radius: 10px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.mini-icon.blue {
  background: #dbeafe;

  color: #1e40af;
}

.mini-icon.orange {
  background: #ffedd5;

  color: #c2410c;
}

.mini-stat strong {
  display: block;

  font-size: 19px;

  color: #0f172a;
}

.mini-stat span {
  display: block;

  margin-top: 1px;

  font-size: 10px;

  color: #64748b;
}

/* PROGRESS */

.progress-section {
  margin-bottom: 22px;
}

.progress-top {
  display: flex;

  justify-content: space-between;

  margin-bottom: 8px;

  font-size: 11px;

  color: #64748b;
}

.progress-top strong {
  color: #1e40af;
}

.progress-bar {
  height: 7px;

  border-radius: 10px;

  background: #e2e8f0;

  overflow: hidden;
}

.progress-value {
  width: 78%;

  height: 100%;

  border-radius: inherit;

  background: linear-gradient(90deg, #1e40af 0%, #3b82f6 100%);
}

/* ISSUE LIST */

.issue-list {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.issue-item {
  display: flex;

  align-items: center;

  gap: 10px;

  padding: 11px 10px;

  border-radius: 11px;

  transition: 0.2s;
}

.issue-item:hover {
  background: #f8fafc;
}

.issue-icon {
  width: 34px;
  height: 34px;

  flex-shrink: 0;

  border-radius: 9px;

  display: flex;

  align-items: center;

  justify-content: center;
}

.issue-icon.maintenance {
  background: #eef2ff;

  color: #4f46e5;
}

.issue-icon.it {
  background: #e0f2fe;

  color: #0284c7;
}

.issue-icon.facility {
  background: #fef3c7;

  color: #d97706;
}

.issue-info {
  flex: 1;

  min-width: 0;
}

.issue-info strong {
  display: block;

  color: #334155;

  font-size: 11px;
}

.issue-info span {
  display: block;

  margin-top: 2px;

  color: #94a3b8;

  font-size: 9px;
}

/* STATUS */

.status {
  flex-shrink: 0;

  padding: 5px 8px;

  border-radius: 20px;

  font-size: 8px;

  font-weight: 800;
}

.status.resolved {
  color: #15803d;

  background: #dcfce7;
}

.status.progress {
  color: #1d4ed8;

  background: #dbeafe;
}

.status.pending {
  color: #b45309;

  background: #fef3c7;
}

/* =====================================================
   HERO BOTTOM
===================================================== */

.hero-bottom {
  width: 100%;
  max-width: 1184px;

  margin: auto;

  padding: 25px 0;

  border-top: 1px solid #cbd5e1;

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 30px;
}

.bottom-item {
  display: flex;

  align-items: center;

  gap: 12px;
}

.bottom-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #dbeafe;

  color: #1e40af;

  border: 1px solid #bfdbfe;
}

.bottom-item strong {
  display: block;

  font-size: 13px;

  color: #1e293b;
}

.bottom-item span {
  display: block;

  margin-top: 3px;

  font-size: 11px;

  color: #64748b;
}

/* =====================================================
   SECTIONS
===================================================== */

.section {
  padding: 105px 28px;

  box-sizing: border-box;
}

.section-heading {
  max-width: 670px;

  margin: 0 auto 60px;

  text-align: center;
}

.section-tag {
  display: inline-block;

  padding: 5px 14px;

  border-radius: 20px;

  background: #dbeafe;

  color: #1e40af;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.8px;

  margin-bottom: 13px;
}

.section-heading h2 {
  margin: 0;

  color: #0f172a;

  font-size: clamp(34px, 4vw, 46px);

  line-height: 1.1;

  letter-spacing: -1.8px;
}

.section-heading p {
  margin: 18px auto 0;

  max-width: 580px;

  color: #475569;

  font-size: 15px;

  line-height: 1.7;
}

/* =====================================================
   HOW IT WORKS (CLEAN WHITE PROFESSIONAL THEME)
===================================================== */

.how-section {
  background: #ffffff;
  position: relative;
}

.how-section .section-tag {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.how-section .section-heading h2 {
  color: #0f172a;
}

.how-section .section-heading p {
  color: #475569;
}

.steps-container {
  max-width: 1120px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: stretch;
  gap: 20px;
}

.step-card {
  position: relative;
  padding: 34px 26px 30px;
  min-height: 290px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba(15, 23, 42, 0.05),
    0 1px 3px rgba(15, 23, 42, 0.03);
}

.step-card.clickable-card {
  cursor: pointer;
}

/* Top accent bar */
.step-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  transition: all 0.35s ease;
}

/* Step 1 — Royal Blue Accent */
.step-card:nth-child(1)::before {
  background: linear-gradient(90deg, #1d4ed8, #3b82f6);
}
.step-card:nth-child(1) .step-number {
  color: #eff6ff;
  -webkit-text-stroke: 1.5px #3b82f6;
}
.step-card:nth-child(1) .step-icon {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1.5px solid #bfdbfe;
}
.step-card:nth-child(1) .step-link {
  color: #1d4ed8;
}
.step-card:nth-child(1):hover {
  border-color: #93c5fd;
  box-shadow:
    0 20px 40px rgba(37, 99, 235, 0.12),
    0 4px 12px rgba(37, 99, 235, 0.06);
}
.step-card:nth-child(1):hover .step-icon {
  background: #1d4ed8;
  color: #ffffff;
  border-color: #1d4ed8;
  box-shadow: 0 6px 18px rgba(29, 78, 216, 0.25);
}
.step-card:nth-child(1):hover .step-number {
  color: #3b82f6;
  -webkit-text-stroke: none;
}

/* Step 2 — Amber / Orange Accent */
.step-card:nth-child(2)::before {
  background: linear-gradient(90deg, #d97706, #f59e0b);
}
.step-card:nth-child(2) .step-number {
  color: #fffbeb;
  -webkit-text-stroke: 1.5px #f59e0b;
}
.step-card:nth-child(2) .step-icon {
  background: #fffbeb;
  color: #d97706;
  border: 1.5px solid #fde68a;
}
.step-card:nth-child(2) .step-link {
  color: #d97706;
}
.step-card:nth-child(2):hover {
  border-color: #fcd34d;
  box-shadow:
    0 20px 40px rgba(217, 119, 6, 0.12),
    0 4px 12px rgba(217, 119, 6, 0.06);
}
.step-card:nth-child(2):hover .step-icon {
  background: #d97706;
  color: #ffffff;
  border-color: #d97706;
  box-shadow: 0 6px 18px rgba(217, 119, 6, 0.25);
}
.step-card:nth-child(2):hover .step-number {
  color: #f59e0b;
  -webkit-text-stroke: none;
}

/* Step 3 — Indigo / Violet Accent */
.step-card:nth-child(3)::before {
  background: linear-gradient(90deg, #4f46e5, #818cf8);
}
.step-card:nth-child(3) .step-number {
  color: #eef2ff;
  -webkit-text-stroke: 1.5px #6366f1;
}
.step-card:nth-child(3) .step-icon {
  background: #eef2ff;
  color: #4f46e5;
  border: 1.5px solid #c7d2fe;
}
.step-card:nth-child(3) .step-link {
  color: #4f46e5;
}
.step-card:nth-child(3):hover {
  border-color: #a5b4fc;
  box-shadow:
    0 20px 40px rgba(79, 70, 229, 0.12),
    0 4px 12px rgba(79, 70, 229, 0.06);
}
.step-card:nth-child(3):hover .step-icon {
  background: #4f46e5;
  color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 6px 18px rgba(79, 70, 229, 0.25);
}
.step-card:nth-child(3):hover .step-number {
  color: #6366f1;
  -webkit-text-stroke: none;
}

/* Step 4 — Emerald / Green Accent */
.step-card:nth-child(4)::before {
  background: linear-gradient(90deg, #059669, #10b981);
}
.step-card:nth-child(4) .step-number {
  color: #ecfdf5;
  -webkit-text-stroke: 1.5px #10b981;
}
.step-card:nth-child(4) .step-icon {
  background: #ecfdf5;
  color: #059669;
  border: 1.5px solid #a7f3d0;
}
.step-card:nth-child(4) .step-link {
  color: #059669;
}
.step-card:nth-child(4):hover {
  border-color: #6ee7b7;
  box-shadow:
    0 20px 40px rgba(16, 185, 129, 0.12),
    0 4px 12px rgba(16, 185, 129, 0.06);
}
.step-card:nth-child(4):hover .step-icon {
  background: #059669;
  color: #ffffff;
  border-color: #059669;
  box-shadow: 0 6px 18px rgba(5, 150, 105, 0.25);
}
.step-card:nth-child(4):hover .step-number {
  color: #10b981;
  -webkit-text-stroke: none;
}

.step-card:hover {
  transform: translateY(-8px);
}

.step-card:hover::before {
  height: 4px;
}

/* Step number */
.step-number {
  position: absolute;
  right: 22px;
  top: 18px;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1;
  transition: all 0.3s ease;
}

/* Step icons */
.step-icon {
  width: 54px;
  height: 54px;
  margin-bottom: 22px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  transition: all 0.3s ease;
}

/* Card typography — 100% crisp and readable */
.step-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.3px;
  color: #0f172a;
}

.step-card p {
  margin: 0;
  color: #475569;
  font-size: 13.5px;
  line-height: 1.75;
  font-weight: 450;
}

/* Step link */
.step-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 20px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1px;
  transition: gap 0.25s ease;
}

.step-card:hover .step-link {
  gap: 10px;
}

/* =====================================================
   FEATURES (CLEAN LIGHT PROFESSIONAL THEME)
===================================================== */

.features-section {
  background: #f8fafc;
  position: relative;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}

.features-section .section-tag {
  background: #eff6ff;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.features-section .section-heading h2 {
  color: #0f172a;
}

.features-section .section-heading p {
  color: #475569;
}

.feature-grid {
  max-width: 1120px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  position: relative;
  min-height: 280px;
  padding: 30px 24px 26px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba(15, 23, 42, 0.05),
    0 1px 3px rgba(15, 23, 42, 0.03);
}

/* Top accent bar */
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 20px 20px 0 0;
  transition: all 0.35s ease;
}

/* Feature 1 — Blue */
.feature-card.feature-blue::before {
  background: linear-gradient(90deg, #0284c7, #38bdf8);
}
.feature-card.feature-blue .feature-icon {
  background: #f0f9ff;
  color: #0284c7;
  border: 1.5px solid #bae6fd;
}
.feature-card.feature-blue .action-text {
  color: #0284c7;
}
.feature-card.feature-blue .feature-arrow {
  color: #0284c7;
  background: #f0f9ff;
  border-color: #bae6fd;
}
.feature-card.feature-blue:hover {
  border-color: #7dd3fc;
  box-shadow:
    0 20px 40px rgba(2, 132, 199, 0.12),
    0 4px 12px rgba(2, 132, 199, 0.06);
}
.feature-card.feature-blue:hover .feature-icon {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

/* Feature 2 — Green */
.feature-card.feature-green::before {
  background: linear-gradient(90deg, #059669, #10b981);
}
.feature-card.feature-green .feature-icon {
  background: #ecfdf5;
  color: #059669;
  border: 1.5px solid #a7f3d0;
}
.feature-card.feature-green .action-text {
  color: #059669;
}
.feature-card.feature-green .feature-arrow {
  color: #059669;
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.feature-card.feature-green:hover {
  border-color: #6ee7b7;
  box-shadow:
    0 20px 40px rgba(5, 150, 105, 0.12),
    0 4px 12px rgba(5, 150, 105, 0.06);
}
.feature-card.feature-green:hover .feature-icon {
  background: #059669;
  color: #ffffff;
  border-color: #059669;
}

/* Feature 3 — Purple */
.feature-card.feature-purple::before {
  background: linear-gradient(90deg, #7c3aed, #a855f7);
}
.feature-card.feature-purple .feature-icon {
  background: #faf5ff;
  color: #7c3aed;
  border: 1.5px solid #e9d5ff;
}
.feature-card.feature-purple .action-text {
  color: #7c3aed;
}
.feature-card.feature-purple .feature-arrow {
  color: #7c3aed;
  background: #faf5ff;
  border-color: #e9d5ff;
}
.feature-card.feature-purple:hover {
  border-color: #d8b4fe;
  box-shadow:
    0 20px 40px rgba(124, 58, 237, 0.12),
    0 4px 12px rgba(124, 58, 237, 0.06);
}
.feature-card.feature-purple:hover .feature-icon {
  background: #7c3aed;
  color: #ffffff;
  border-color: #7c3aed;
}

/* Feature 4 — Orange */
.feature-card.feature-orange::before {
  background: linear-gradient(90deg, #ea580c, #f59e0b);
}
.feature-card.feature-orange .feature-icon {
  background: #fff7ed;
  color: #ea580c;
  border: 1.5px solid #fed7aa;
}
.feature-card.feature-orange .action-text {
  color: #ea580c;
}
.feature-card.feature-orange .feature-arrow {
  color: #ea580c;
  background: #fff7ed;
  border-color: #fed7aa;
}
.feature-card.feature-orange:hover {
  border-color: #fdba74;
  box-shadow:
    0 20px 40px rgba(234, 88, 12, 0.12),
    0 4px 12px rgba(234, 88, 12, 0.06);
}
.feature-card.feature-orange:hover .feature-icon {
  background: #ea580c;
  color: #ffffff;
  border-color: #ea580c;
}

/* Feature 5 — Cyan */
.feature-card.feature-cyan::before {
  background: linear-gradient(90deg, #0891b2, #06b6d4);
}
.feature-card.feature-cyan .feature-icon {
  background: #ecfeff;
  color: #0891b2;
  border: 1.5px solid #a5f3fc;
}
.feature-card.feature-cyan .action-text {
  color: #0891b2;
}
.feature-card.feature-cyan .feature-arrow {
  color: #0891b2;
  background: #ecfeff;
  border-color: #a5f3fc;
}
.feature-card.feature-cyan:hover {
  border-color: #67e8f9;
  box-shadow:
    0 20px 40px rgba(8, 145, 178, 0.12),
    0 4px 12px rgba(8, 145, 178, 0.06);
}
.feature-card.feature-cyan:hover .feature-icon {
  background: #0891b2;
  color: #ffffff;
  border-color: #0891b2;
}

/* Feature 6 — Indigo */
.feature-card.feature-indigo::before {
  background: linear-gradient(90deg, #3730a3, #4f46e5);
}
.feature-card.feature-indigo .feature-icon {
  background: #eef2ff;
  color: #3730a3;
  border: 1.5px solid #c7d2fe;
}
.feature-card.feature-indigo .action-text {
  color: #3730a3;
}
.feature-card.feature-indigo .feature-arrow {
  color: #3730a3;
  background: #eef2ff;
  border-color: #c7d2fe;
}
.feature-card.feature-indigo:hover {
  border-color: #a5b4fc;
  box-shadow:
    0 20px 40px rgba(55, 48, 163, 0.12),
    0 4px 12px rgba(55, 48, 163, 0.06);
}
.feature-card.feature-indigo:hover .feature-icon {
  background: #3730a3;
  color: #ffffff;
  border-color: #3730a3;
}

/* Hover lift and card interactions */
.feature-card:hover {
  transform: translateY(-8px);
}

.feature-card:hover::before {
  height: 4px;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.08);
}

.feature-card h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.2px;
}

.feature-card p {
  margin: 0;
  color: #475569;
  font-size: 13.5px;
  line-height: 1.75;
}

.feature-action {
  margin-top: auto;
  padding-top: 22px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: gap 0.2s ease;
}

.action-text {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.1px;
}

.feature-arrow {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  transition: all 0.25s ease;
}

.feature-card:hover .feature-action {
  gap: 12px;
}

.feature-card:hover .feature-arrow {
  transform: translateX(4px);
}

/* =====================================================
   INTERACTIVE MODALS
===================================================== */
.track-modal-card,
.info-modal-card {
  width: min(580px, 92vw);
  background: #0d1527;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 28px;
  box-sizing: border-box;
  color: #f1f5f9;
  box-shadow:
    0 25px 70px rgba(0, 0, 0, 0.55),
    0 10px 25px rgba(30, 64, 175, 0.2);
}

.track-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 6px;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.track-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: -0.4px;
}

.modal-close {
  color: #94a3b8;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #ffffff;
}

/* Search box */
.track-search-box {
  margin-bottom: 16px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 4px 6px 4px 14px;
  gap: 8px;
  transition: border-color 0.2s;
}

.search-input-wrap:focus-within {
  border-color: #38bdf8;
  background: rgba(255, 255, 255, 0.07);
}

.search-icon {
  color: #94a3b8;
  font-size: 18px;
}

.search-input-wrap input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #f8fafc;
  font-size: 13.5px;
}

.search-input-wrap input::placeholder {
  color: #64748b;
}

.search-btn {
  background: linear-gradient(135deg, #1e40af, #2563eb);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.search-btn:hover {
  opacity: 0.9;
}

.sample-chips {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chips-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.sample-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.sample-chip:hover,
.sample-chip.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #38bdf8;
}

/* Track Details Box */
.track-details-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px;
  margin-top: 12px;
}

.track-evidence {
  margin-top: 16px;
}

.evidence-label {
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.track-evidence a,
.detail-evidence a {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  color: #38bdf8;
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

.track-evidence img {
  display: block;
  width: min(100%, 360px);
  max-height: 220px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  object-fit: cover;
}

.details-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.issue-ref-tag {
  font-size: 11px;
  color: #94a3b8;
}
.issue-ref-tag strong {
  color: #38bdf8;
}

.track-issue-title {
  margin: 4px 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
}

.track-issue-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11px;
  color: #94a3b8;
}
.track-issue-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.track-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  text-transform: capitalize;
}

.track-status-pill.in-progress {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.3);
}

.track-status-pill.resolved {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.track-status-pill.under-review,
.track-status-pill.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.track-status-pill.rejected {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Timeline */
.track-timeline {
  margin: 16px 0 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.timeline-node {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.timeline-node:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  left: 11px;
  width: 2px;
  height: calc(100% - 10px);
  background: rgba(255, 255, 255, 0.1);
}

.timeline-node.completed:not(:last-child)::after {
  background: #38bdf8;
}

.node-marker {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.08);
  color: #64748b;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-node.completed .node-marker {
  background: #38bdf8;
  color: #0d1527;
}

.timeline-node.current .node-marker {
  background: rgba(56, 189, 248, 0.2);
  border: 2px solid #38bdf8;
  color: #38bdf8;
}

.pulse-ring {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3);
}

.node-content {
  flex: 1;
}

.node-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.node-title-row strong {
  font-size: 13px;
  color: #f1f5f9;
}
.node-time {
  font-size: 11px;
  color: #64748b;
}

.node-content p {
  margin: 2px 0 0;
  font-size: 11.5px;
  color: #94a3b8;
  line-height: 1.5;
}

/* Modal actions */
.track-modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-report-btn {
  background: linear-gradient(135deg, #1e40af, #2563eb);
  color: white;
  border-radius: 10px;
  font-weight: 700;
  padding: 0 16px;
  font-size: 12.5px;
}

.modal-dismiss-btn {
  color: #94a3b8;
  font-weight: 600;
  font-size: 12.5px;
}

/* Info modal body */
.info-modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-box-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
}

.info-box-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.info-box-item strong {
  display: block;
  font-size: 13px;
  color: #f1f5f9;
}
.info-box-item p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.alert-item {
  position: relative;
  padding: 12px 14px 12px 28px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.alert-indicator {
  position: absolute;
  top: 16px;
  left: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.live-alert .alert-indicator {
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}
.resolved-alert .alert-indicator {
  background: #22c55e;
}
.info-alert .alert-indicator {
  background: #eab308;
}

.alert-item strong {
  display: block;
  font-size: 13px;
  color: #f8fafc;
}
.alert-item p {
  margin: 2px 0 4px;
  font-size: 12px;
  color: #94a3b8;
}
.alert-time {
  font-size: 10.5px;
  color: #64748b;
  font-weight: 600;
}

.role-desc {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 12px;
}

.role-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #94a3b8;
}
.role-list li .q-icon {
  color: #38bdf8;
}

/* =====================================================
   NAVBAR ENHANCEMENTS & USER CHIP
===================================================== */

.user-nav-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  margin-right: 6px;
}

.mobile-menu-btn {
  display: none;
  color: #334155;
}

.mobile-nav-drawer {
  display: none;
  position: absolute;
  top: 76px;
  left: 0;
  right: 0;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12);
  padding: 16px 20px 20px;
  flex-direction: column;
  gap: 6px;
  z-index: 999;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #475569;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  background: #eff6ff;
  color: #1d4ed8;
}

.mobile-drawer-footer {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.mobile-report-btn {
  width: 100%;
  min-height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e40af, #2563eb);
  color: white;
  font-weight: 700;
}

/* =====================================================
   ABOUT SECTION & PILLARS
===================================================== */

.about-section {
  background: #ffffff;
  padding: 85px 28px 75px;
  box-sizing: border-box;
  border-top: 1px solid #e2e8f0;
}

.about-section .section-tag {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.about-section .section-heading h2 {
  color: #0f172a;
}

.about-section .section-heading p {
  color: #475569;
}

.about-grid {
  max-width: 1120px;
  margin: 0 auto 55px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.about-card {
  padding: 34px 28px;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 20px rgba(15, 23, 42, 0.04),
    0 1px 3px rgba(15, 23, 42, 0.02);
}

.about-card:hover {
  transform: translateY(-6px);
  border-color: #cbd5e1;
  background: #ffffff;
  box-shadow:
    0 18px 36px rgba(15, 23, 42, 0.08),
    0 4px 12px rgba(15, 23, 42, 0.04);
}

.about-card-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.about-card:hover .about-card-icon {
  transform: scale(1.08);
}

.about-blue {
  background: #eff6ff;
  color: #2563eb;
  border: 1.5px solid #bfdbfe;
}

.about-green {
  background: #f0fdf4;
  color: #16a34a;
  border: 1.5px solid #bbf7d0;
}

.about-purple {
  background: #faf5ff;
  color: #7c3aed;
  border: 1.5px solid #e9d5ff;
}

.about-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.3px;
  color: #0f172a;
}

.about-card p {
  margin: 0;
  color: #64748b;
  font-size: 13.5px;
  line-height: 1.75;
}

/* =====================================================
   CTA
===================================================== */

.cta-container {
  max-width: 1120px;
  margin: auto;
  padding: 50px 55px;
  box-sizing: border-box;
  border-radius: 22px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.15),
    0 8px 20px rgba(30, 64, 175, 0.1);
}

.cta-container::after {
  content: '';
  position: absolute;
  width: 350px;
  height: 350px;
  right: -100px;
  top: -160px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.18);
}

.cta-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.cta-icon {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  color: #93c5fd;
  font-size: 25px;
}

.cta-label {
  color: #93c5fd;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.cta-content h2 {
  margin: 5px 0 7px;
  color: white;
  font-size: 31px;
  letter-spacing: -1px;
}

.cta-content h2 span {
  color: #60a5fa;
}

.cta-content p {
  max-width: 560px;
  margin: 0;
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.6;
}

.cta-btn {
  position: relative;
  z-index: 3;
  min-height: 48px;
  padding: 0 24px;
  border-radius: 10px;
  background: white;
  color: #1e40af;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* =====================================================
   FOOTER
===================================================== */

.footer {
  background: #0a1628;
  color: white;
  padding: 60px 28px 25px;
  box-sizing: border-box;
}

.footer-container {
  max-width: 1120px;
  margin: auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 80px;
}

.footer-brand p {
  max-width: 250px;
  margin-top: 18px;
  color: #8293ad;
  font-size: 12px;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-column h4 {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: white;
}

.footer-column a {
  color: #8293ad;
  text-decoration: none;
  font-size: 11px;
  transition: 0.2s;
  cursor: pointer;
}

.footer-column a:hover {
  color: white;
}

.footer-bottom {
  max-width: 1120px;
  margin: 50px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 10px;
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 1100px) {
  .desktop-nav {
    gap: 20px;
  }

  .hero-container {
    gap: 40px;
  }

  .steps-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: inline-flex;
  }

  .mobile-nav-drawer {
    display: flex;
  }

  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-content {
    max-width: 700px;
    margin: auto;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-trust {
    justify-content: center;
  }

  .hero-visual {
    max-width: 600px;
    width: 100%;
    margin: auto;
  }

  .steps-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .footer-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .navbar {
    height: 68px;
  }

  .nav-container {
    padding: 0 17px;
  }

  .nav-report-btn {
    display: none;
  }

  .brand-name {
    font-size: 13px;
  }

  .hero-container {
    padding: 65px 20px 40px;
  }

  .hero-title {
    font-size: 49px;
    letter-spacing: -2.5px;
  }

  .hero-description {
    font-size: 14px;
  }

  .hero-buttons {
    flex-direction: column;
    width: 100%;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
  }

  .hero-bottom {
    grid-template-columns: 1fr;
    padding: 25px 20px;
    box-sizing: border-box;
  }

  .dashboard-card {
    padding: 18px;
  }

  .mini-stats {
    gap: 8px;
  }

  .mini-stat {
    padding: 11px;
  }

  .issue-item {
    gap: 7px;
  }

  .issue-info strong {
    font-size: 10px;
  }

  .status {
    font-size: 7px;
    padding: 4px 6px;
  }

  .section {
    padding: 65px 20px;
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .cta-container {
    padding: 32px 25px;
    flex-direction: column;
    align-items: flex-start;
  }

  .cta-content {
    align-items: flex-start;
  }

  .cta-content h2 {
    font-size: 27px;
  }

  .cta-btn {
    width: 100%;
  }

  .footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .footer-links {
    grid-template-columns: 1fr 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 420px) {
  .hero-title {
    font-size: 42px;
  }

  .dashboard-header h3 {
    font-size: 17px;
  }

  .mini-stat strong {
    font-size: 16px;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }
}
</style>
