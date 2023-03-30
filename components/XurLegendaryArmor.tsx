import Link from "next/link";

export default function XurLegendaryArmor() {
  return (
    <div className="rewards-container section-metadata">
      <h4>Legendary Armor</h4>

      <p className="footnote">
        Legendary armor and rolls for other items can be seen on{" "}
        <Link href="/xur">Xur&apos;s detail page</Link>
      </p>
    </div>
  );
}
