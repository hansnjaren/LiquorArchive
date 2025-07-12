"use client";

import React, { useState, ReactNode, ReactElement } from "react";
export function TabList({ children }: { children: React.ReactNode }) {
  return <div className="w-full flex justify-center">{children}</div>;
}