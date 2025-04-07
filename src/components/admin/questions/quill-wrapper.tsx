"use client";

import type React from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface QuillWrapperProps {
	value: string;
	onChange: (value: string) => void;
	modules: any;
	formats: string[];
	placeholder?: string;
	readOnly?: boolean;
	theme?: string;
	className?: string;
	style?: React.CSSProperties;
}

const QuillWrapper = forwardRef<ReactQuill, QuillWrapperProps>((props, ref) => {
	const quillRef = useRef<ReactQuill>(null);

	useImperativeHandle(ref, () => {
		return quillRef.current as ReactQuill;
	});

	return <ReactQuill ref={quillRef} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";

export default QuillWrapper;
