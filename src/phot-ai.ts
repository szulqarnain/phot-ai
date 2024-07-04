import axios from "axios";

export const removeObject = async (
  sourceName: any,
  source: any,
  object: any
) => {
  try {
    let data = JSON.stringify({
      file_name: sourceName,
      input_image_link: source,
      //   input_image_link:
      //     "https://t4.ftcdn.net/jpg/02/03/93/37/360_F_203933746_tKo4FKePrZRR2RemV3fn76AqEhdJ0BNk.jpg",
      mask_image: object,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://prodapi.phot.ai/external/api/v2/user_activity/object-replacer",
      headers: {
        "x-api-key": "66864fe2f689944a899c21e6_21647531a8d9efee72d3_apyhitools",
        "Content-Type": "application/json",
      },
      data: data,
    };

    const res: any = await axios.request(config);

    if (res?.data) {
      return res.data;
    }
  } catch (err: any) {
    console.error("Error:", err);
    return {
      error: err?.message,
      message: "Check you input files and try again",
    };
  }
};
