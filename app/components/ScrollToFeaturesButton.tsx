"use client";

interface ScrollToFeaturesButtonProps {
  className?: string;
  children: React.ReactNode;
}

export default function ScrollToFeaturesButton({
  className,
  children,
}: ScrollToFeaturesButtonProps) {
  const handleScrollToFeatures = () => {
    const featuresElement = document.getElementById("features");
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={handleScrollToFeatures}
      className={className}
      tabIndex={0}
      aria-label="Learn more about features"
    >
      {children}
    </button>
  );
}
