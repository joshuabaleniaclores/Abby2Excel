import { Github, Linkedin, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-8 mt-12 border-t bg-background/50 backdrop-blur-sm">
            <div className="container max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-muted-foreground font-medium flex items-center gap-2 animate-pulse">
                    Stay consistent, you got this!
                </p>

                <div className="flex items-center gap-6">
                    <Link
                        href="https://github.com/joshuabaleniaclores"
                        target="_blank"
                        className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                            <Github className="w-5 h-5" />
                        </div>
                        <span>GitHub</span>
                    </Link>

                    <Link
                        href="https://www.linkedin.com/in/joshua-clores/"
                        target="_blank"
                        className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </div>
                        <span>LinkedIn</span>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground/60 mt-4 flex items-center gap-2">
                    Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Abby
                </p>
            </div>
        </footer>
    );
}
