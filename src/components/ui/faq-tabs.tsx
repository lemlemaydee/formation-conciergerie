"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  id?: string;
  title?: string;
  subtitle?: string;
  categories: Record<string, string>;
  faqData: Record<string, FaqItem[]>;
  className?: string;
  footer?: ReactNode;
}

export function FAQ({
  id,
  title = "FAQs",
  subtitle = "Frequently Asked Questions",
  categories,
  faqData,
  className,
  footer,
}: FaqProps) {
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);

  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 overflow-hidden bg-background px-4 py-16 text-foreground sm:py-24",
        className,
      )}
    >
      <FAQHeader title={title} subtitle={subtitle} />
      <FAQTabs categories={categories} selected={selectedCategory} setSelected={setSelectedCategory} />
      <FAQList faqData={faqData} selected={selectedCategory} />
      {footer && <div className="relative z-10 mx-auto mt-10 max-w-3xl text-center">{footer}</div>}
    </section>
  );
}

function FAQHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center">
      <span className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-medium text-transparent">
        {subtitle}
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight text-balance text-foreground sm:text-4xl">
        <span className="bg-gradient-to-r from-primary via-primary to-primary/50 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <span className="absolute -top-[350px] left-[50%] z-0 h-[500px] w-[600px] -translate-x-[50%] rounded-full bg-gradient-to-r from-primary/10 to-gold/10 blur-3xl" />
    </div>
  );
}

function FAQTabs({
  categories,
  selected,
  setSelected,
}: {
  categories: Record<string, string>;
  selected: string;
  setSelected: (key: string) => void;
}) {
  return (
    <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-3">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          onClick={() => setSelected(key)}
          className={cn(
            "relative overflow-hidden whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-500",
            selected === key
              ? "border-primary text-primary-foreground"
              : "border-border bg-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          <span className="relative z-10">{label}</span>
          <AnimatePresence>
            {selected === key && (
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.5, ease: "backIn" }}
                className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80"
              />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
}

function FAQList({
  faqData,
  selected,
}: {
  faqData: Record<string, FaqItem[]>;
  selected: string;
}) {
  return (
    <div className="relative z-10 mx-auto mt-10 max-w-3xl">
      <AnimatePresence mode="wait">
        {Object.entries(faqData).map(([category, questions]) => {
          if (selected !== category) return null;
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-3"
            >
              {questions.map((faq) => (
                <FAQItemCard key={faq.question} {...faq} />
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function FAQItemCard({ question, answer }: FaqItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn(
        "rounded-2xl border transition-colors",
        isOpen ? "border-border bg-muted/50" : "border-border bg-card",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
      >
        <span
          className={cn(
            "text-base font-medium transition-colors sm:text-lg",
            isOpen ? "text-foreground" : "text-foreground/90",
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{ open: { rotate: "45deg" }, closed: { rotate: "0deg" } }}
          transition={{ duration: 0.2 }}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted"
        >
          <Plus className={cn("size-4", isOpen ? "text-primary" : "text-muted-foreground")} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : "0px", marginBottom: isOpen ? "16px" : "0px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4 sm:px-5"
      >
        <p className="text-sm text-muted-foreground sm:text-base">{answer}</p>
      </motion.div>
    </motion.div>
  );
}
