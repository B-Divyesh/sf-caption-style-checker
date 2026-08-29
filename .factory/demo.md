# Demo sandbox

Open `/demo` or `/?demo=1` to enter the sample checker directly. It loads a
three-cue WebVTT lesson intro with speaker markup, emphasis, placement settings,
and one deliberately fast cue.

The banner says **Demo — sample data, nothing is saved**. Visitors can replace
the sample and check their edit without leaving the sandbox. **Reset demo**
reloads the shipped sample. **Start for real** discards the demo edit and
restores the previous real session, if one exists. Demo state only exists in
memory; it never reads or writes the real `caption-source` local storage key.
Real mode saves the current pasted source under `caption-source` so a refresh
does not lose it.
