"""
Job Searcher — searches for jobs via JSearch API (RapidAPI) or returns mock data.
"""
import requests
import config


MOCK_JOBS = [
    {
        "job_id": "mock-001",
        "title": "Senior Python Developer",
        "company": "TechCorp Inc.",
        "location": "Remote",
        "description": "We are looking for a Senior Python Developer with experience in FastAPI, Django, and cloud services (AWS/GCP). Strong knowledge of REST APIs, databases, and CI/CD pipelines is required. 5+ years experience.",
        "url": "https://example.com/jobs/1",
        "salary": "$120k - $160k",
        "posted": "2 days ago",
    },
    {
        "job_id": "mock-002",
        "title": "Full Stack Developer",
        "company": "StartupXYZ",
        "location": "Berlin, Germany",
        "description": "Join our growing team as a Full Stack Developer. You'll work with React, Node.js, TypeScript, and PostgreSQL. Experience with Docker and Kubernetes is a plus. Remote-friendly.",
        "url": "https://example.com/jobs/2",
        "salary": "$90k - $130k",
        "posted": "1 day ago",
    },
    {
        "job_id": "mock-003",
        "title": "Machine Learning Engineer",
        "company": "AI Solutions Ltd.",
        "location": "San Francisco, CA",
        "description": "Looking for an ML Engineer to build production ML pipelines. Proficiency in Python, TensorFlow/PyTorch, and cloud platforms required. NLP experience preferred.",
        "url": "https://example.com/jobs/3",
        "salary": "$140k - $200k",
        "posted": "3 days ago",
    },
    {
        "job_id": "mock-004",
        "title": "Backend Engineer",
        "company": "DataFlow Corp",
        "location": "Remote",
        "description": "Backend Engineer needed for our data platform team. Must have strong Python, SQL, Redis experience. Familiarity with microservices architecture and event-driven systems.",
        "url": "https://example.com/jobs/4",
        "salary": "$100k - $140k",
        "posted": "5 hours ago",
    },
    {
        "job_id": "mock-005",
        "title": "React Frontend Developer",
        "company": "DesignHub",
        "location": "London, UK",
        "description": "Frontend Developer with expertise in React, TypeScript, Tailwind CSS. Experience with Next.js and design systems is preferred. UI/UX sensibility is a must.",
        "url": "https://example.com/jobs/5",
        "salary": "$80k - $120k",
        "posted": "1 day ago",
    },
    {
        "job_id": "mock-006",
        "title": "DevOps Engineer",
        "company": "CloudNative Inc.",
        "location": "Remote",
        "description": "DevOps Engineer to manage our Kubernetes clusters, CI/CD pipelines, and AWS infrastructure. Terraform, Docker, and monitoring tools experience required.",
        "url": "https://example.com/jobs/6",
        "salary": "$110k - $150k",
        "posted": "4 days ago",
    },
    {
        "job_id": "mock-007",
        "title": "Flutter Mobile Developer",
        "company": "AppWorks",
        "location": "Dubai, UAE",
        "description": "Flutter Developer to build cross-platform mobile apps. Dart expertise, REST API integration, state management (BLoC/Riverpod). Firebase experience preferred.",
        "url": "https://example.com/jobs/7",
        "salary": "$70k - $100k",
        "posted": "2 days ago",
    },
    {
        "job_id": "mock-008",
        "title": "Data Engineer",
        "company": "AnalyticsPro",
        "location": "New York, NY",
        "description": "Data Engineer to build ETL pipelines with Python, Apache Spark, and Airflow. Strong SQL skills and experience with data warehousing solutions required.",
        "url": "https://example.com/jobs/8",
        "salary": "$130k - $170k",
        "posted": "6 hours ago",
    },
]


def search_jobs_jsearch(query: str, location: str = "", num_results: int = 10) -> list[dict]:
    """
    Search jobs using JSearch API (RapidAPI).
    Requires RAPIDAPI_KEY in config.
    """
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": config.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {
        "query": f"{query} in {location}" if location else query,
        "page": "1",
        "num_pages": "1",
    }

    try:
        response = requests.get(url, headers=headers, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        jobs = []
        for item in data.get("data", [])[:num_results]:
            jobs.append({
                "job_id": item.get("job_id", ""),
                "title": item.get("job_title", ""),
                "company": item.get("employer_name", ""),
                "location": item.get("job_city", "") or item.get("job_country", "Remote"),
                "description": item.get("job_description", "")[:2000],
                "url": item.get("job_apply_link", "") or item.get("job_google_link", ""),
                "salary": f"{item.get('job_min_salary', 'N/A')} - {item.get('job_max_salary', 'N/A')}",
                "posted": item.get("job_posted_at_datetime_utc", "Recently"),
            })
        return jobs
    except Exception as e:
        print(f"JSearch API error: {e}")
        return []


def search_jobs(query: str, location: str = "", num_results: int = 10) -> list[dict]:
    """
    Search jobs — uses real API if configured, otherwise returns mock data.
    """
    if config.DEMO_MODE or not config.RAPIDAPI_KEY:
        print("[DEMO MODE] Returning mock job listings")
        # Filter mock jobs by relevance to query
        query_lower = query.lower()
        scored = []
        for job in MOCK_JOBS:
            text = f"{job['title']} {job['description']}".lower()
            score = sum(1 for word in query_lower.split() if word in text)
            scored.append((score, job))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [job for _, job in scored[:num_results]]
    else:
        return search_jobs_jsearch(query, location, num_results)
