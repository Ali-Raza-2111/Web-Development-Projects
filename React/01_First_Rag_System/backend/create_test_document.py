"""
Script to create a test PDF document for the RAG system.
Run this script to generate a sample document for testing retrieval accuracy.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
import os

def create_test_document():
    """Create a test PDF document for RAG system testing."""
    
    # Output path
    output_dir = os.path.join(os.path.dirname(__file__), "test_documents")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "NeuralTech_Company_Handbook.pdf")
    
    # Create document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor='#1a365d'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceBefore=20,
        spaceAfter=12,
        textColor='#2563eb'
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubheading',
        parent=styles['Heading3'],
        fontSize=13,
        spaceBefore=15,
        spaceAfter=8,
        textColor='#374151'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # Build content
    story = []
    
    # ==================== PAGE 1: Title & Company Overview ====================
    story.append(Paragraph("NeuralTech Solutions", title_style))
    story.append(Paragraph("Company Handbook & Policy Guide", styles['Heading2']))
    story.append(Paragraph("Version 3.2 | Effective Date: January 2026", styles['Normal']))
    story.append(Spacer(1, 40))
    
    story.append(Paragraph("1. Company Overview", heading_style))
    story.append(Paragraph(
        """NeuralTech Solutions was founded in 2019 by Dr. Sarah Chen and Marcus Williams 
        in San Francisco, California. The company specializes in enterprise artificial 
        intelligence solutions, focusing on natural language processing and machine learning 
        infrastructure. As of January 2026, NeuralTech employs 847 full-time employees 
        across 12 global offices.""",
        body_style
    ))
    
    story.append(Paragraph(
        """Our headquarters is located at 1250 Innovation Drive, San Francisco, CA 94107. 
        The company operates with a hybrid work model, allowing employees to work remotely 
        up to 3 days per week. Core office hours are Monday through Friday, 10:00 AM to 
        4:00 PM Pacific Time.""",
        body_style
    ))
    
    story.append(Paragraph("1.1 Mission Statement", subheading_style))
    story.append(Paragraph(
        """NeuralTech's mission is to democratize artificial intelligence by building 
        intuitive, secure, and scalable solutions that empower organizations to harness 
        the full potential of their data. We believe in responsible AI development with 
        transparency, fairness, and human oversight at the core of every product we create.""",
        body_style
    ))
    
    story.append(Paragraph("1.2 Core Values", subheading_style))
    story.append(Paragraph(
        """• Innovation Excellence: We push boundaries and embrace creative problem-solving.<br/>
        • Customer Obsession: Every decision starts with understanding customer needs.<br/>
        • Ethical AI: We build AI systems that are fair, transparent, and accountable.<br/>
        • Collaborative Spirit: Great achievements come from diverse teams working together.<br/>
        • Continuous Learning: We invest in personal and professional growth.""",
        body_style
    ))
    
    story.append(PageBreak())
    
    # ==================== PAGE 2: Employee Benefits ====================
    story.append(Paragraph("2. Employee Benefits & Compensation", heading_style))
    
    story.append(Paragraph("2.1 Health Insurance", subheading_style))
    story.append(Paragraph(
        """NeuralTech provides comprehensive health coverage through BlueCross BlueShield. 
        The company covers 90% of employee premiums and 75% of dependent premiums. 
        Coverage includes medical, dental, and vision plans. Employees are eligible for 
        benefits on the first day of the month following their start date.""",
        body_style
    ))
    
    story.append(Paragraph("2.2 Paid Time Off (PTO)", subheading_style))
    story.append(Paragraph(
        """All full-time employees receive 20 days of PTO annually, which increases to 
        25 days after 3 years of service and 30 days after 7 years. Additionally, 
        NeuralTech observes 11 paid company holidays per year. Unused PTO can be 
        carried over up to a maximum of 10 days into the following year.""",
        body_style
    ))
    
    story.append(Paragraph("2.3 Parental Leave", subheading_style))
    story.append(Paragraph(
        """New parents are entitled to 16 weeks of fully paid parental leave, regardless 
        of gender. This policy applies to both biological and adoptive parents. 
        Employees may take parental leave within the first 12 months following the 
        birth or adoption of a child. A gradual return-to-work program is available.""",
        body_style
    ))
    
    story.append(Paragraph("2.4 Retirement & Stock Options", subheading_style))
    story.append(Paragraph(
        """NeuralTech offers a 401(k) retirement plan with a company match of up to 6% 
        of the employee's salary. The vesting schedule is 25% per year over 4 years. 
        All full-time employees also receive stock options as part of their compensation 
        package, with a standard 4-year vesting period and 1-year cliff.""",
        body_style
    ))
    
    story.append(Paragraph("2.5 Professional Development", subheading_style))
    story.append(Paragraph(
        """Each employee has access to a $5,000 annual learning budget for courses, 
        conferences, certifications, and educational materials. The company also 
        provides free access to LinkedIn Learning, Coursera, and O'Reilly Media. 
        Team leads may approve additional funding for specialized training programs.""",
        body_style
    ))
    
    story.append(PageBreak())
    
    # ==================== PAGE 3: Travel & Expense Policy ====================
    story.append(Paragraph("3. Travel & Expense Policy", heading_style))
    
    story.append(Paragraph("3.1 Business Travel Authorization", subheading_style))
    story.append(Paragraph(
        """All business travel must be pre-approved by the employee's direct manager 
        at least 5 business days before the trip. Domestic travel under $2,000 requires 
        manager approval only. International travel or domestic travel exceeding $2,000 
        requires additional approval from the department head.""",
        body_style
    ))
    
    story.append(Paragraph("3.2 Airfare & Transportation", subheading_style))
    story.append(Paragraph(
        """Employees should book economy class for flights under 6 hours. Business class 
        is permitted for flights exceeding 6 hours or for employees with documented 
        medical requirements. All bookings must be made through the company's designated 
        travel portal, TravelPerk. Ground transportation expenses including taxis, 
        rideshares, and rental cars are reimbursable with receipts.""",
        body_style
    ))
    
    story.append(Paragraph("3.3 Accommodation", subheading_style))
    story.append(Paragraph(
        """Hotel bookings should not exceed $250 per night for domestic travel and $350 
        per night for international travel. Exceptions may be granted for high-cost 
        cities such as New York, San Francisco, London, and Tokyo, where the limit is 
        increased to $400 per night. Employees are encouraged to book hotels with 
        corporate rates when available.""",
        body_style
    ))
    
    story.append(Paragraph("3.4 Meals & Daily Allowances", subheading_style))
    story.append(Paragraph(
        """The per diem meal allowance is $75 for domestic travel and $100 for 
        international travel. This covers breakfast, lunch, and dinner. Alcohol 
        expenses are not reimbursable unless part of a client entertainment event 
        approved by a director-level or above manager. Tips up to 20% are included 
        in the per diem calculation.""",
        body_style
    ))
    
    story.append(Paragraph("3.5 Expense Reimbursement Process", subheading_style))
    story.append(Paragraph(
        """All expense reports must be submitted within 30 days of the trip completion 
        through the Expensify platform. Receipts are required for all expenses over $25. 
        Reimbursements are processed within 10 business days of approval. Late submissions 
        may result in delayed reimbursement or denial.""",
        body_style
    ))
    
    story.append(PageBreak())
    
    # ==================== PAGE 4: Project Management & Deadlines ====================
    story.append(Paragraph("4. Project Management Guidelines", heading_style))
    
    story.append(Paragraph("4.1 Current Active Projects", subheading_style))
    story.append(Paragraph(
        """<b>Project Aurora</b> - Enterprise RAG Platform<br/>
        Lead: Dr. James Martinez | Budget: $2.4 million<br/>
        Start Date: March 15, 2025 | Deadline: September 30, 2026<br/>
        Description: Development of a scalable retrieval-augmented generation platform 
        for enterprise document processing and intelligent search capabilities.""",
        body_style
    ))
    
    story.append(Paragraph(
        """<b>Project Nexus</b> - Customer Analytics Dashboard<br/>
        Lead: Priya Sharma | Budget: $850,000<br/>
        Start Date: June 1, 2025 | Deadline: February 28, 2026<br/>
        Description: Building a real-time analytics dashboard with AI-powered insights 
        for tracking customer engagement and predicting churn.""",
        body_style
    ))
    
    story.append(Paragraph(
        """<b>Project Sentinel</b> - AI Security Module<br/>
        Lead: Alex Thompson | Budget: $1.2 million<br/>
        Start Date: August 10, 2025 | Deadline: May 15, 2026<br/>
        Description: Implementation of advanced threat detection using machine learning 
        models to identify and prevent security vulnerabilities in AI systems.""",
        body_style
    ))
    
    story.append(Paragraph("4.2 Stakeholder Communication", subheading_style))
    story.append(Paragraph(
        """Project stakeholders for all major initiatives include: CEO Dr. Sarah Chen, 
        CTO Marcus Williams, VP of Engineering Lisa Park, VP of Product David Kim, 
        and CFO Robert Johnson. Weekly status updates are required every Friday by 
        3:00 PM PT. Monthly executive reviews are held on the first Monday of each month.""",
        body_style
    ))
    
    story.append(Paragraph("4.3 Sprint Cycles & Agile Process", subheading_style))
    story.append(Paragraph(
        """NeuralTech follows a 2-week sprint cycle. Sprint planning occurs on Monday 
        mornings, daily standups are at 9:30 AM, and sprint retrospectives are held 
        on the last Friday of each sprint. All teams use Jira for project tracking 
        and GitHub for version control. Code reviews require at least 2 approvals 
        before merging to the main branch.""",
        body_style
    ))
    
    story.append(PageBreak())
    
    # ==================== PAGE 5: IT & Security Policies ====================
    story.append(Paragraph("5. Information Technology & Security", heading_style))
    
    story.append(Paragraph("5.1 Password Requirements", subheading_style))
    story.append(Paragraph(
        """All employee passwords must meet the following criteria: minimum 14 characters, 
        at least one uppercase letter, one lowercase letter, one number, and one special 
        character. Passwords must be changed every 90 days and cannot be reused within 
        the last 12 password cycles. Multi-factor authentication (MFA) is mandatory 
        for all company systems.""",
        body_style
    ))
    
    story.append(Paragraph("5.2 Data Classification", subheading_style))
    story.append(Paragraph(
        """NeuralTech uses a four-tier data classification system:<br/>
        • <b>Public</b>: Information intended for public release (marketing materials)<br/>
        • <b>Internal</b>: General company information for employees only<br/>
        • <b>Confidential</b>: Sensitive business data requiring restricted access<br/>
        • <b>Restricted</b>: Highly sensitive data including PII, financial records, and trade secrets""",
        body_style
    ))
    
    story.append(Paragraph("5.3 Remote Work Security", subheading_style))
    story.append(Paragraph(
        """Employees working remotely must use the company VPN (Cisco AnyConnect) when 
        accessing internal systems. Personal devices may not be used to access 
        confidential or restricted data. Company-issued laptops have full disk encryption 
        enabled and must be locked when unattended. Public WiFi usage requires VPN 
        connection at all times.""",
        body_style
    ))
    
    story.append(Paragraph("5.4 Incident Reporting", subheading_style))
    story.append(Paragraph(
        """Any suspected security incident must be reported immediately to the Security 
        Operations Center (SOC) at security@neuraltech.io or by calling the 24/7 hotline 
        at 1-888-NT-SECURE (1-888-687-3287). Employees should not attempt to investigate 
        or remediate security incidents independently. The incident response team will 
        provide guidance within 1 hour of report submission.""",
        body_style
    ))
    
    story.append(PageBreak())
    
    # ==================== PAGE 6: Q3 2025 Financial Summary ====================
    story.append(Paragraph("6. Q3 2025 Financial Report Summary", heading_style))
    
    story.append(Paragraph("6.1 Revenue Performance", subheading_style))
    story.append(Paragraph(
        """NeuralTech achieved total revenue of $47.3 million in Q3 2025, representing 
        a 34% year-over-year increase. Subscription revenue accounted for $38.2 million 
        (81% of total revenue), while professional services contributed $9.1 million. 
        Annual Recurring Revenue (ARR) reached $156 million, up from $118 million in 
        Q3 2024.""",
        body_style
    ))
    
    story.append(Paragraph("6.2 Customer Metrics", subheading_style))
    story.append(Paragraph(
        """The company added 127 new enterprise customers in Q3, bringing the total 
        customer count to 892. Customer retention rate remained strong at 94.7%. 
        Average contract value increased to $175,000 from $142,000 in the previous 
        year. Net Promoter Score (NPS) improved to 72, up from 68 in Q2.""",
        body_style
    ))
    
    story.append(Paragraph("6.3 Operating Expenses", subheading_style))
    story.append(Paragraph(
        """Total operating expenses for Q3 2025 were $41.8 million. Research and 
        Development expenditure was $18.5 million (44% of OpEx), Sales and Marketing 
        was $14.2 million (34%), and General & Administrative was $9.1 million (22%). 
        The company maintained a healthy gross margin of 78%.""",
        body_style
    ))
    
    story.append(Paragraph("6.4 Profitability & Cash Position", subheading_style))
    story.append(Paragraph(
        """NeuralTech reported an operating income of $5.5 million in Q3 2025, 
        achieving profitability for the third consecutive quarter. Net income was 
        $4.2 million after taxes. Cash and cash equivalents stood at $89 million 
        as of September 30, 2025. The company has no long-term debt.""",
        body_style
    ))
    
    story.append(Paragraph("6.5 2026 Financial Outlook", subheading_style))
    story.append(Paragraph(
        """For fiscal year 2026, NeuralTech projects total revenue between $210 million 
        and $225 million. The company plans to invest heavily in AI research, with 
        R&D spending expected to increase by 40%. Headcount is projected to grow to 
        1,100 employees by year-end. The Series D funding round of $75 million closed 
        in October 2025, led by Sequoia Capital.""",
        body_style
    ))
    
    # Build PDF
    doc.build(story)
    print(f"✅ Test document created successfully: {output_path}")
    
    # Print sample questions
    print("\n" + "="*60)
    print("📝 SAMPLE TEST QUESTIONS FOR RAG SYSTEM")
    print("="*60)
    
    questions = [
        "Who founded NeuralTech and when?",
        "How many days of PTO do employees get after 3 years?",
        "What is the parental leave policy?",
        "What is the per diem meal allowance for international travel?",
        "What is the deadline for Project Aurora?",
        "Who are the stakeholders for major projects?",
        "What are the password requirements?",
        "What was NeuralTech's Q3 2025 revenue?",
        "What is the company's customer retention rate?",
        "How much is the annual learning budget per employee?",
        "What is the hotel limit for New York City?",
        "What is the budget for Project Sentinel?",
        "Who leads Project Nexus and what is it about?",
        "What is the company's mission statement?",
        "How much is the 401k company match?",
    ]
    
    for i, q in enumerate(questions, 1):
        print(f"{i:2}. {q}")
    
    print("\n" + "="*60)
    print(f"📄 Upload the PDF from: {output_path}")
    print("="*60)
    
    return output_path


if __name__ == "__main__":
    create_test_document()
