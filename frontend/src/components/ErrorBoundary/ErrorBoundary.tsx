/**
 * Global error boundary to prevent full UI crashes
 * and provide a safe fallback screen.
 */

import React from "react";
import styles from "./ErrorBoundary.module.css";
import LogoImage from "../../assets/digital-earth.png";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  state = { hasError: false, message: undefined as string | undefined };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }

  private handleTryAgain = () => {
    window.location.reload();
  };

  private handleRefresh = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const title = "Something went wrong";
    const subtitle =
      this.state.message ??
      "We couldn’t load this screen. Try again, or refresh the page.";

    return (
      <main className={styles.page} role="alert" aria-live="polite">
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={this.handleTryAgain}
            >
              Try again
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={this.handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>

        <img
          className={styles.earth}
          src={LogoImage}
          alt=""
          draggable={false}
        />
      </main>
    );
  }
}
