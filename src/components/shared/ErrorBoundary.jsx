import React from "react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl clay-element p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              خطایی رخ داد!
            </h1>
            <p className="text-gray-600 mb-6">
              لطفاً صفحه را مجدداً بارگذاری کنید
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-2xl"
            >
              بارگذاری مجدد
            </Button>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  جزئیات خطا
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl overflow-auto max-h-40">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
