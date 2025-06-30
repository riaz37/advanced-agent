import streamlit as st
from src.workflow import Workflow
from src.models import ResearchState

st.set_page_config(page_title="Developer Tools Research Agent", layout="wide")
st.title("🔎 Developer Tools Research Agent")

st.markdown("""
This tool helps you research and compare developer tools using advanced LLM and web research workflows. Enter your query (e.g., "API monitoring tools") and get structured, actionable insights.
""")

query = st.text_input("Enter your research query:", "API monitoring tools")
run_button = st.button("Run Research")

if run_button and query:
    with st.spinner("Running research workflow..."):
        try:
            workflow = Workflow()
            result: ResearchState = workflow.run(query)
        except Exception as e:
            st.error(f"Error running workflow: {e}")
            st.stop()

    st.subheader("Extracted Tools")
    if result.extracted_tools:
        st.write(", ".join(result.extracted_tools))
    else:
        st.write("No tools extracted.")

    st.subheader("Companies & Tool Details")
    if result.companies:
        for company in result.companies:
            with st.expander(company.name):
                st.markdown(f"**Website:** [{company.website}]({company.website})")
                st.markdown(f"**Description:** {company.description}")
                st.markdown(f"**Pricing Model:** {company.pricing_model}")
                st.markdown(f"**Open Source:** {company.is_open_source}")
                st.markdown(f"**API Available:** {company.api_available}")
                st.markdown(f"**Tech Stack:** {', '.join(company.tech_stack) if company.tech_stack else 'N/A'}")
                st.markdown(f"**Language Support:** {', '.join(company.language_support) if company.language_support else 'N/A'}")
                st.markdown(f"**Integration Capabilities:** {', '.join(company.integration_capabilities) if company.integration_capabilities else 'N/A'}")
                st.markdown(f"**Developer Experience Rating:** {company.developer_experience_rating}")
                if company.competitors:
                    st.markdown(f"**Competitors:** {', '.join(company.competitors)}")
    else:
        st.write("No company information found.")

    st.subheader("LLM Analysis & Recommendations")
    if result.analysis:
        st.markdown(result.analysis)
    else:
        st.write("No analysis generated.")

st.markdown("---")
st.caption("Built with ❤️ by Riaz.") 