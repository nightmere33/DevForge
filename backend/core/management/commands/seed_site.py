from django.core.management.base import BaseCommand
from core.models import SiteConfiguration, Skill, FAQ, Testimonial
from services.models import Service
from subscriptions.models import SupportPlan


class Command(BaseCommand):
    help = "Seed the site with initial configuration, skills and services (idempotent)."

    def handle(self, *args, **options):
        config = SiteConfiguration.get_solo()
        if not config.about_text:
            config.hero_title = "I build web, mobile & automation solutions that work."
            config.hero_subtitle = (
                "Freelance full-stack developer and Master's student in Computer Science "
                "(Mobile Networks & Embedded Systems). From modern websites and Flutter apps "
                "to Selenium/Playwright automation — I turn your ideas into products."
            )
            config.tagline = "Full-Stack Developer & Automation Expert"
            config.about_text = (
                "I'm a freelance developer currently finishing my Master's degree in Computer Science, "
                "specializing in Mobile Networks and Embedded Systems.\n"
                "I build all kinds of software: modern websites with React and Django, mobile apps with "
                "Flutter/Dart and native Java, Windows desktop applications, and powerful automation "
                "tools with Selenium and Playwright.\n"
                "One of my biggest projects is a complete Airbnb-like booking platform, which I'm now "
                "turning into my own startup. When I take on your project, I bring the same "
                "product-level quality to it."
            )
            config.email = "younesoft2017@gmail.com"
            config.github_url = "https://github.com/nightmere33"
            config.availability = "Available for freelance work"
            config.footer_text = "© DevForge — Built with React & Django."
            config.save()
            self.stdout.write(self.style.SUCCESS("Site configuration seeded."))
        else:
            self.stdout.write("Site configuration already filled — skipped.")

        skills = [
            ('Python', 'languages', 95), ('JavaScript / TypeScript', 'languages', 90),
            ('Java', 'languages', 85), ('Dart', 'languages', 85), ('C', 'languages', 80), ('SQL', 'languages', 85),
            ('React', 'web', 90), ('Django', 'web', 92), ('Node.js', 'web', 80), ('Tailwind CSS', 'web', 88),
            ('Flutter', 'mobile', 88), ('Android (Java)', 'mobile', 82),
            ('Selenium', 'automation', 95), ('Playwright', 'automation', 92), ('Web Scraping', 'automation', 93),
            ('TCP/IP & Networking', 'embedded', 85), ('IoT', 'embedded', 80),
            ('Arduino / Raspberry Pi', 'embedded', 82), ('Embedded C', 'embedded', 78),
            ('Git', 'tools', 90), ('Docker', 'tools', 75), ('Linux', 'tools', 85),
        ]
        created = 0
        for i, (name, category, level) in enumerate(skills):
            _, was_created = Skill.objects.get_or_create(
                name=name, defaults={'category': category, 'level': level, 'order': i}
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Skills: {created} created."))

        services = [
            ("Web Development",
             "Modern, responsive websites and web applications built with React and Django. "
             "From landing pages to full platforms with authentication, payments and dashboards.",
             "🌐", "$300 - $3000"),
            ("Mobile App Development",
             "Cross-platform mobile apps with Flutter/Dart or native Android with Java. "
             "One codebase, beautiful apps on both iOS and Android.",
             "📱", "$500 - $5000"),
            ("Automation & Web Scraping",
             "Custom automation bots and data-extraction pipelines with Selenium and Playwright. "
             "Save hours of manual work: form filling, monitoring, testing, scraping at scale.",
             "🤖", "$100 - $1500"),
            ("Booking & Marketplace Platforms",
             "Complete Airbnb-style booking platforms: listings, search, reservations, reviews and payments. "
             "I built one from scratch — I can build yours.",
             "🏠", "$1500 - $8000"),
            ("Desktop Applications",
             "Windows desktop tools and utilities tailored to your workflow, from simple helpers "
             "to full business applications.",
             "🖥️", "$300 - $2500"),
            ("API Development & Integration",
             "REST APIs with Django REST Framework, third-party integrations, "
             "and connecting your systems together.",
             "🔌", "$200 - $2000"),
        ]
        created = 0
        for i, (title, description, icon, price) in enumerate(services):
            _, was_created = Service.objects.get_or_create(
                title=title,
                defaults={'description': description, 'icon': icon, 'price_range': price, 'order': i}
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Services: {created} created."))

        plans = [
            ("Basic Support", "Keep your project healthy with essential maintenance.",
             49, 1, "Bug fixes\nSecurity updates\nEmail support (48h response)\n1 small change per month", False),
            ("Pro Support", "For businesses that need their product evolving continuously.",
             129, 1, "Everything in Basic\nPriority support (24h response)\n4 changes or improvements per month\nPerformance monitoring\nMonthly report", True),
            ("Partner", "I act as your dedicated technical partner.",
             299, 1, "Everything in Pro\nSame-day urgent fixes\nUnlimited small changes\nNew feature development (discounted rate)\nStrategy calls", False),
        ]
        created = 0
        for i, (name, description, price, months, features, popular) in enumerate(plans):
            _, was_created = SupportPlan.objects.get_or_create(
                name=name,
                defaults={'description': description, 'price': price, 'period_months': months,
                          'features': features, 'popular': popular, 'order': i}
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Support plans: {created} created."))

        faqs = [
            ("How long does a project take?",
             "It depends on the size: a landing page takes 3-7 days, a full web platform 3-8 weeks, "
             "a mobile app 4-10 weeks. You get a precise timeline with your quote, and you can follow "
             "the progress live from your dashboard."),
            ("How do payments work?",
             "We agree on a fixed price before any work starts. Typically 30-50% upfront and the rest "
             "on delivery. I accept bank transfer, CCP/BaridiMob and international methods — whatever "
             "is easiest for you."),
            ("Can I request changes during the project?",
             "Yes! You follow the progress from your dashboard with screenshots and videos, and we chat "
             "directly on the platform. Reasonable revisions are included in the price."),
            ("What happens after delivery?",
             "Every project includes a free support period for bug fixes. After that you can subscribe "
             "to a support plan and I keep maintaining, updating and improving your product."),
            ("Do you work with clients outside Algeria?",
             "Absolutely — I work remotely with clients worldwide in English, French and Arabic."),
        ]
        created = 0
        for i, (q, a) in enumerate(faqs):
            _, was_created = FAQ.objects.get_or_create(question=q, defaults={'answer': a, 'order': i})
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"FAQs: {created} created."))

        # Sample testimonials — edit or replace these with real client reviews from the admin panel
        testimonials = [
            ("Karim B.", "Founder, online store",
             "Younes built my e-commerce site faster than I expected and kept me updated the whole time. "
             "I could literally watch the progress. Highly recommend.", 5),
            ("Sarah M.", "Startup founder",
             "Professional, responsive and talented. He turned my rough idea into a real working app. "
             "The communication was perfect.", 5),
            ("Yacine T.", "Small business owner",
             "Great automation work that saved me hours every week. Fair price and delivered on time. "
             "Will work with him again.", 5),
        ]
        created = 0
        for i, (name, role, content, rating) in enumerate(testimonials):
            _, was_created = Testimonial.objects.get_or_create(
                name=name,
                defaults={'role': role, 'content': content, 'rating': rating, 'approved': True, 'order': i}
            )
            created += was_created
        self.stdout.write(self.style.SUCCESS(f"Testimonials: {created} created."))
