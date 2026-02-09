import { Database, ExternalLink, FolderOpen, Lock, Mail, Settings, Share2, ShieldCheck, AlertCircle, Copy, FileEdit } from "lucide-react";

// Reusable Section Component
const PolicySection = ({ icon, title, children, delay = 0 }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
}) => (
    <section
        className="group relative rounded-2xl bg-white p-6 md:p-8 hover:bg-[#fef0e7] transition-all duration-500 border border-[#ebe6e080] animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="absolute inset-0 rounded-2xl gradient-soft opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative">
            <div className="flex items-center gap-4 mb-5">
                <div className="shrink-0 w-12 h-12 rounded-xl gradient-warm flex items-center justify-center shadow-soft">
                    {icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    </section>
);

// Reusable Bullet Point Component
const BulletPoint = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#f06542] mt-2.5" />
        <span>{children}</span>
    </li>
);

// Main Policy Component
const PrivacyPolicy = () => {
    return (
        <section className="py-24 bg-[#fbfaf8]">
            <div className="container mx-auto px-6">
                {/* Badge */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef0e7] text-[#bd320f] text-sm font-medium shadow-soft">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Privacy & Data Security</span>
                    </div>
                </div>

                {/* Section header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Privacy <span className="text-gradient">& Usage Policy</span>
                    </h2>
                    <p className="text-[#67677e] text-lg max-w-2xl mx-auto">
                        We provide the tools to organize and decorate your cloud storage. Here is exactly how we handle your files.
                    </p>
                    <p className="text-sm text-[#67677e] mt-4">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>

                <main className="max-w-4xl mx-auto px-4 pb-20 space-y-6">

                    {/* SECTION 1: File Operations (The most critical part based on your request) */}
                    <PolicySection
                        icon={<Copy className="w-6 h-6 text-white" />}
                        title="File Operations & Storage"
                        delay={300}
                    >
                        <p className="font-medium text-foreground mb-2">
                            We act as a controller, not a storage facility.
                        </p>
                        <ul className="space-y-3">
                            <BulletPoint>
                                <strong>Standard Actions:</strong> When you perform actions like <em>copy</em>, <em>paste</em>, <em>rename</em>, or <em>share</em> folders and files, these commands are executed directly via the secure APIs provided by Dropbox and Google Drive.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>No Database Storage of Files:</strong> We strictly do <strong>not</strong> store your folders, files, or their content in our database. Your data remains solely on your cloud provider's servers.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>What We Store:</strong> We only store the <em>decoration data</em> you apply (e.g., "Folder X has the 'Blue Ocean' theme" or "File Y has a custom icon"). This ensures your decorations persist when you return.
                            </BulletPoint>
                        </ul>
                    </PolicySection>

                    {/* SECTION 2: Data Collection */}
                    <PolicySection
                        icon={<Database className="w-6 h-6 text-white" />}
                        title="Data Collection"
                        delay={400}
                    >
                        <ul className="space-y-3">
                            <BulletPoint>
                                <strong>Authorized Metadata Only:</strong> To enable decoration and file management, we access folder names, file lists, and icons strictly as permitted via OAuth.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>Account Identifiers:</strong> We use your basic profile info (e.g., email) solely to link your decoration settings to your account.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>Server Logs:</strong> We retain standard security logs (IP addresses, request times) for abuse prevention. These are never sold or used for marketing profiling.
                            </BulletPoint>
                        </ul>
                    </PolicySection>

                    {/* SECTION 3: Sharing Capabilities */}
                    <PolicySection
                        icon={<Share2 className="w-6 h-6 text-white" />}
                        title="Sharing Capabilities"
                        delay={500}
                    >
                        <ul className="space-y-3">
                            <BulletPoint>
                                <strong>Native Sharing:</strong> If you use our interface to share a file or folder, we invoke the provider's native sharing mechanism. We do not create our own sharing links or bypass your provider's security settings.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>No Third-Party Selling:</strong> We do not sell, rent, or trade your file lists or personal data with advertisers or third parties.
                            </BulletPoint>
                        </ul>
                    </PolicySection>

                    {/* SECTION 4: User Controls */}
                    <PolicySection
                        icon={<Lock className="w-6 h-6 text-white" />}
                        title="User Controls & Security"
                        delay={600}
                    >
                        <ul className="space-y-3">
                            <BulletPoint>
                                <strong>Revocation:</strong> You can revoke our access at any time via your Google or Dropbox security settings. We will immediately lose the ability to manage or view your files.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>Data Deletion:</strong> If you delete our account or unlink your storage, we permanently delete your decoration preferences from our database. Your original files remain untouched on your cloud drive.
                            </BulletPoint>
                            <BulletPoint>
                                <strong>Encryption:</strong> All communication between your browser, our servers, and the Dropbox/Google APIs is encrypted using HTTPS/TLS.
                            </BulletPoint>
                        </ul>
                    </PolicySection>

                    {/* SECTION 5: Children's Privacy */}
                    <PolicySection
                        icon={<AlertCircle className="w-6 h-6 text-white" />}
                        title="Children's Privacy"
                        delay={650}
                    >
                        <p>
                            Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
                        </p>
                    </PolicySection>

                    {/* SECTION 6: Third-Party Policies */}
                    <PolicySection
                        icon={<ExternalLink className="w-6 h-6 text-white" />}
                        title="Third-Party Policies"
                        delay={800}
                    >
                        <p>
                            Since your actual files reside on Dropbox or Google servers, please review their privacy policies to understand how they protect your data at rest.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                            <a
                                href="https://www.dropbox.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fef0e7] text-[#bd320f] hover:bg-secondary/80 transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Dropbox Policy
                            </a>
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fef0e7] text-[#bd320f] hover:bg-secondary/80 transition-colors text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Google Policy
                            </a>
                        </div>
                    </PolicySection>

                    {/* SECTION 7: Contact Us */}
                    <PolicySection
                        icon={<Mail className="w-6 h-6 text-white" />}
                        title="Contact Us"
                        delay={900}
                    >
                        <p>
                            If you have questions about this policy, your data, or our security practices, please reach out to us.
                        </p>
                        <div className="mt-4">
                            <a
                                href="mailto:admin@dekka.com.au"
                                className="text-[#f06542] font-semibold hover:underline"
                            >
                                admin@dekka.com.au
                            </a>
                        </div>
                    </PolicySection>
                </main>
            </div>
        </section>
    )
}

export default PrivacyPolicy
