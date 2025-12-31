export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Postify
                        </h3>
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} Postify. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-500 hover:text-violet-600 transition-colors">Twitter</a>
                        <a href="#" className="text-gray-500 hover:text-violet-600 transition-colors">GitHub</a>
                        <a href="#" className="text-gray-500 hover:text-violet-600 transition-colors">Terms</a>
                        <a href="#" className="text-gray-500 hover:text-violet-600 transition-colors">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
