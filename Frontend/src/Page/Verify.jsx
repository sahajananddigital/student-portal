import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Verify = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/api/verify-certificate.php?id=${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return null;

  if (!data.verified) {
    return <h2>❌ Certificate Not Valid</h2>;
  }

  return (
    <>
      <h2>✔ Certificate Verified</h2>
      <p>Name: {data.data.full_name}</p>
      <p>Position: {data.data.position}</p>
      <p>Start: {data.data.start_date}</p>
      <p>End: {data.data.end_date}</p>
      <p>Issued: {data.data.issue_date}</p>
    </>
  );
};

export default Verify;
