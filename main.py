import streamlit as st

# Setup the Page
st.set_page_config(page_title="My Personal Hub", layout="wide")
st.title("⚡ My Personal Work Hub")

# Create the Tabs (Instagram-style navigation)
tab1, tab2, tab3 = st.tabs(["Dashboard", "Tasks", "Notes"])

with tab1:
    st.header("Daily Progress")
    st.progress(45)
    st.write("Chapter 1: 45% Complete")

with tab2:
    st.header("To-Do List")
    st.checkbox("Math Assignment")
    st.checkbox("Physics PYQs")
    st.checkbox("History Notes")

with tab3:
    st.header("Quick Notes")
    st.text_area("Note", "Don't forget the exam on Friday!")
