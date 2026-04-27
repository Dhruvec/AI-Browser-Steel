document.getElementById("sidebar").innerHTML = `
<div class="w-60 bg-secondary flex flex-col h-full border-r border-border">
    <div class="p-6">
        <h2 class="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-6">Quick Access</h2>
        <div class="space-y-1">
            <div class="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-tertiary/50 hover:text-text-primary text-text-secondary transition-all group" onclick="quickOpen('youtube.com')">
                <div class="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-all">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <span class="text-sm font-medium">YouTube</span>
            </div>
            
            <div class="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-tertiary/50 hover:text-text-primary text-text-secondary transition-all group" onclick="quickOpen('instagram.com')">
                <div class="p-2 bg-pink-500/10 text-pink-500 rounded-lg group-hover:bg-pink-500 group-hover:text-white transition-all">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <span class="text-sm font-medium">Instagram</span>
            </div>
            
            <div class="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-tertiary/50 hover:text-text-primary text-text-secondary transition-all group" onclick="quickOpen('github.com')">
                <div class="p-2 bg-gray-500/10 text-text-primary rounded-lg group-hover:bg-text-primary group-hover:text-secondary transition-all">
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </div>
                <span class="text-sm font-medium">GitHub</span>
            </div>
        </div>
    </div>
</div>
`