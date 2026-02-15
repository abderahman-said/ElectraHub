import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4" dir="rtl">
                    <div className="max-w-lg w-full">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-red-100">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-5xl">⚠️</span>
                            </div>
                            <h1 className="text-3xl font-black text-blue-950 mb-4">عذراً، حدث خطأ!</h1>
                            <p className="text-slate-600 font-medium mb-8">
                                حدث خطأ غير متوقع. يرجى تحديث الصفحة أو المحاولة مرة أخرى.
                            </p>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-right bg-red-50 rounded-xl p-6 mb-6 border border-red-200">
                                    <summary className="font-bold text-red-700 cursor-pointer mb-2">تفاصيل الخطأ (وضع التطوير)</summary>
                                    <pre className="text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </details>
                            )}
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-100"
                                >
                                    العودة للرئيسية
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-4 glass rounded-2xl font-black text-sm uppercase tracking-widest text-blue-950 hover:bg-white transition-all"
                                >
                                    تحديث الصفحة
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
