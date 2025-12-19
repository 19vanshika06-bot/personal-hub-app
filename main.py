import streamlit as st

# The core app code
st.set_page_config(page_title="My Personal Hub", layout="wide")
st.title("⚡ My Personal Work Hub")

tab1, tab2, tab3 = st.tabs(["Dashboard", "Tasks", "Notes"])

with tab1:
    st.header("Daily Progress")
    st.progress(45)
    st.write("Chapter 1: 45% Complete")

with tab2:
    st.checkbox("Math Assignment")
    st.checkbox("Physics PYQs")
    st.checkbox("History Notes")

with tab3:
    st.text_area("Quick Note", "Don't forget the exam on Friday!")
